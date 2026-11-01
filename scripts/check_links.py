#!/usr/bin/env python3
"""检查仓库内 Markdown / LaTeX 的链接健康度。

三类检查：
1. 仓库内自引用（github.com/<owner>/<repo>/{blob,tree}/main/<path>）→ 直接查本地文件是否存在，离线可判定，因此不再重复走网络；
2. 站内页面（enco1128.github.io/<site>/...）→ 是否仍指向改名前的旧 Pages 地址；
3. 外部链接 → 仅在 --net 时探测。403/202/429 等反爬响应与超时都只报告，不计为死链。

默认退出码：仓库内引用或旧地址检查失败 → 1。加 --net-fail 让确认失效（404/410）也致命。
"""
from __future__ import annotations

import argparse
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {'.md', '.tex'}
URL_RE = re.compile(r'https?://[^\s)\]<>"\'`，。、]+')
TRAILING = '}.,;!?"\''
BLOCKED = {401, 403, 202, 412, 418, 429, 451, 503}
DEAD = {404, 410}

# 站点常量：仓库改名时这里必须与 docs/.vitepress/config.mts 同步
SITE = 'enco1128.github.io/MedSynapse-Research-group-study-materials'
REPO_SLUG = 'enco1128/MedSynapse-Research-group-study-materials'
LEGACY_PAGES = {'AUFE-Research-group-study-materials', 'Research-group-study-materials'}
SELF_LINK_RE = re.compile(rf'github\.com/{REPO_SLUG}/(?:blob|tree)/main/(.+?)(?:[?#]|$)')


def text_files() -> list[pathlib.Path]:
    out = []
    for p in ROOT.rglob('*'):
        if '.git' in p.parts or 'node_modules' in p.parts or not p.is_file():
            continue
        if p.suffix.lower() in TEXT_SUFFIXES:
            out.append(p)
    return out


def check_repo_self_link(url: str) -> tuple[bool, str | None]:
    """返回 (是否为仓库内引用, 错误说明)。"""
    m = SELF_LINK_RE.search(url)
    if not m:
        return False, None
    rel = urllib.parse.unquote(m.group(1)).replace('\\', '/')
    if (ROOT / rel).exists():
        return True, None
    return True, f'仓库内引用不存在: {rel}'


def check_legacy_pages(url: str) -> str | None:
    if 'enco1128.github.io/' not in url:
        return None
    parts = url.split('://', 1)[1].split('/')
    slug = parts[1] if len(parts) > 1 else ''
    if slug in LEGACY_PAGES:
        return f'指向已失效的旧 Pages 地址: /{slug}/'
    return None


def probe(url: str, timeout: int) -> str:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (link-check)'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return f'ok {r.status}'
    except urllib.error.HTTPError as e:
        if e.code in BLOCKED:
            return 'blocked'
        return 'dead' if e.code in DEAD else f'http {e.code}'
    except (urllib.error.URLError, TimeoutError, OSError):
        return 'timeout'


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--net', action='store_true', help='探测外部链接（需要网络）')
    ap.add_argument('--net-fail', action='store_true', help='确认失效（404/410）也让脚本失败')
    ap.add_argument('--timeout', type=int, default=15)
    args = ap.parse_args()

    urls: dict[str, set[str]] = {}
    for f in text_files():
        for raw in URL_RE.findall(f.read_text(encoding='utf-8', errors='ignore')):
            url = raw.rstrip(TRAILING)
            if 'shields.io' in url or 'example.com' in url:
                continue
            urls.setdefault(url, set()).add(str(f.relative_to(ROOT)))

    structural, dead, blocked, other, slow, ok, verified_local = [], [], [], [], [], 0, 0
    for url in sorted(urls):
        is_self, err = check_repo_self_link(url)
        if err:
            structural.append(f'{url} -> {err}  ({"; ".join(sorted(urls[url]))})')
        if is_self:
            verified_local += 1
        legacy = check_legacy_pages(url)
        if legacy:
            structural.append(f'{url} -> {legacy}  ({"; ".join(sorted(urls[url]))})')
        if not args.net or is_self or url.startswith(f'https://{SITE}'):
            continue
        state = probe(url, args.timeout)
        if state.startswith('ok'):
            ok += 1
        elif state == 'blocked':
            blocked.append(url)
        elif state == 'dead':
            dead.append(url)
        elif state == 'timeout':
            slow.append(url)
        else:
            other.append(f'{url} ({state})')

    print(f'扫描到 {len(urls)} 条唯一链接')
    if args.net:
        print(f'  仓库内引用本地已验证 {verified_local} 条（跳过网络）')
        print(f'  外部：可达 {ok} · 确认失效 {len(dead)} · 反爬拦截 {len(blocked)} · 其他状态 {len(other)} · 超时 {len(slow)}')
    else:
        print('  未启用 --net，仅做仓库内引用与旧地址检查')
    for line in structural:
        print('  [结构] ' + line)
    for line in dead:
        print('  [失效] ' + line)
    for line in blocked:
        print('  [拦截] ' + line + '  （反爬，需人工确认，勿直接判定为死链）')
    for line in other:
        print('  [其他] ' + line + '  （非典型响应，不计为死链）')
    for line in slow:
        print('  [超时] ' + line + '  （不计为死链）')

    if structural:
        return 1
    if args.net_fail and dead:
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())

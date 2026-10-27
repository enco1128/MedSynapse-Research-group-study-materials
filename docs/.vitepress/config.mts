import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'

const siteTitle = '课题组科研入门'
const repo = 'https://github.com/enco1128/AUFE-Research-group-study-materials'
const site = 'https://enco1128.github.io/AUFE-Research-group-study-materials/'

const vitePressOptions = {
  lang: 'zh-CN',
  title: siteTitle,
  description:
    '课题组科研入门：深度学习 / 计算机视觉 / 医学影像 AI 全流程指南（网页 · Overleaf · 仓库三端对齐）',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: [
    /^https?:\/\/localhost/,
    /^https?:\/\/127\.0\.0\.1/
  ],
  base: '/AUFE-Research-group-study-materials/',
  head: [
    ['link', { rel: 'icon', href: '/AUFE-Research-group-study-materials/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#1a3a4a' }],
    ['meta', { property: 'og:title', content: siteTitle }],
    ['meta', { property: 'og:description', content: '从文献到投稿的科研全流程入门体系' }],
    ['meta', { property: 'og:url', content: site }]
  ],
  themeConfig: {
    siteTitle,
    logo: '/logo.svg',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '未找到结果',
            resetButtonTitle: '清空',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    nav: [
      { text: '首页', link: '/' },
      {
        text: '学习路径',
        items: [
          { text: '导论与心态', link: '/1-导论/1-为何做科研' },
          { text: '研究过程与 Meeting', link: '/1-导论/3-研究过程与能力' },
          { text: '文献检索与精读', link: '/2-文献/1-文献检索与精读' },
          { text: '学术汇报', link: '/2-文献/2-学术汇报' },
          { text: '代码与工程', link: '/3-代码/1-代码与工程基础' },
          { text: 'Idea 与实验', link: '/4-实验/1-Idea与实验' },
          { text: '写作与投稿', link: '/5-写作/1-写作工具与投稿' },
          { text: '章节写法 / 画图 / Rebuttal', link: '/5-写作/2-论文结构与章节写法' },
          { text: '课题范式', link: '/6-课题范式/1-问题拆解框架' }
        ]
      },
      { text: '8周路线', link: '/7-路线图/1-八周学习路径' },
      { text: '附录', link: '/8-附录/1-资源索引' },
      { text: 'GitHub', link: repo }
    ],
    socialLinks: [{ icon: 'github', link: repo }],
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '上次更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: '在 GitHub 上编辑此页'
    },
    footer: {
      message: '网页 · Overleaf 手册 · 仓库资源三端同构 · 字体：华文中宋 / Times New Roman',
      copyright: `Copyright © ${new Date().getFullYear()} AUFE课题组 · <a href="${repo}">GitHub</a>`
    }
  }
}

const vitePressSidebarOptions = {
  documentRootPath: '/docs',
  collapsed: false,
  collapseDepth: 2,
  sortMenusOrderNumericallyFromTitle: true,
  removePrefixAfterOrdering: true,
  prefixSeparator: '-'
}

export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions))

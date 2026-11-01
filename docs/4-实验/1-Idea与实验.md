# Idea 与实验

> **MedSynapse课题组科研入门** · 对应论文章节：**Experiments**  
> 仓库资源：[`resources/04-experiment/`](https://github.com/enco1128/MedSynapse-Research-group-study-materials/tree/main/resources/04-experiment) · 手册第四篇

## 本页目标

- 区分 Problem-/Goal-driven 与 Method-driven  
- 会用五条路径**找问题**，再找解法  
- 会做「简单实验」验证核心 challenge  

## 阶段时间表（粗估）

| 阶段 | 约需 | 任务 |
|------|------|------|
| 想 idea | 1–2 月 | 规划任务、找 failure case、构思解法 |
| 做实验 | 2–3 月 | 简单验证 → 简单数据 → 真实数据 |
| 写论文 | ~1 月 | 倒排节点、写作、自查、修改 |

## 想 Idea 的两步

1. **选一个好的研究问题**  
2. **寻求问题的解决方案**  

### Problem-driven vs Method-driven

- **Problem- / Goal-driven（更推荐）**：先定重要问题或目标，再选技术把它做 work；也可新建 Benchmark 把问题定义清楚；或在通用 Benchmark 上挖关键挑战再改进。  
- **Method-driven**：拿着新锤子找钉子（新范式出现时常见）。  

多数时候两者融合；组内更偏好先对齐问题/目标，再适配与优化方法。

## 如何找到研究问题

1. **批判性阅读**：把「读文献」与「提问题」绑在一起；换数据/换假设会怎样？  
2. **从失败中找机会**：主动找并复现 failure case，归因后再设计解法  
3. **从「为何有效」反推机制**：对效果好但解释不足的方法做 reverse-engineering 式分析  
4. **矛盾与不一致**：相似设定却相反结论 → 对照实验定位分歧来源（问题往往已「半定义」）  
5. **真实场景倒推**：实习痛点；CCF/CAAI 企业联合基金、企业揭榜挂帅等已抽象好的问题  

**值不值得做**：与导师讨论；高年级逐步建立独立判断——是否令你兴奋？是否方向瓶颈？

## 如何解决问题（解法类型）

| 类型 | 含义 | 例子直觉 |
|------|------|----------|
| 迁移型 | 从其他领域借成熟技术 | ViT：注意力从文本到图像 |
| 结合型 | 有创新性的组合，而非简单拼接 | DQN：深度学习 × 强化学习 |
| 开创型 | 重构问题规则 | AlphaFold 式范式转换 |
| AI 辅助 | 用 AI 讨论扩展候选解，自己负责筛选与验证 | — |

## Failure Cases → 解法（实验侧）

1. 在更难 case / 新数据上找失败模式  
2. 抽象成 technical challenge  
3. 从「武器库」组合 technique  
4. 好工作往往不是简单 A+B，而是巧妙结合  

出现「新锤子」（扩散、大模型等）时，用它推进自己 roadmap 上的里程碑，常更有影响力。

## 先简单后真实

简单实验：只保留要验证的那个 core challenge。证明 work 后再上真实数据并补对比与消融。

实验记录：日期、步骤、想法、失败、配置、图表、下一步——可回溯。扩展清单见 [`idea_finding.md`](https://github.com/enco1128/MedSynapse-Research-group-study-materials/blob/main/resources/04-experiment/idea_finding.md)。

## 经典精读清单

见 [`classic_models.md`](https://github.com/enco1128/MedSynapse-Research-group-study-materials/blob/main/resources/04-experiment/classic_models.md)  
配合 [李沐论文精读](https://github.com/mli/paper-reading)：ResNet → Transformer → GAN → 对比学习 → Swin → CLIP → …

## Checklist

- [ ] 写下当前课题的 1 个 failure case 或矛盾点  
- [ ] 标出你更偏 Problem-driven 还是 Method-driven  
- [ ] 设计一个「只验证该 challenge」的简单实验  
- [ ] 精读清单至少完成 1 项  

## 进入下一阶段

[写作工具与投稿](/5-写作/1-写作工具与投稿)

# AGENTS.md — 牛马命历 项目规则

> 本文档用于约束 Codex、Claude Code 及其他 coding agent 的后续开发行为。

## 项目身份

- 产品名：**牛马命历**
- 定位：给当代年轻人的轻量命理情绪解签工具（移动端 H5）
- 产品主线：黄历看天时，易卦看事情，风水看空间，AI 负责说人话

## 全局规则

1. 所有页面必须遵守 `DESIGN_SYSTEM.md`
2. 当前主题为 **peach-blush 粉色版**
3. 所有颜色必须来自 Tailwind theme token 或 CSS 变量，禁止硬编码
4. 移动端优先，页面最大宽度 **430px**，居中显示

## 禁止项

- 禁止把背景改成米黄色
- 禁止使用大面积亮黄色
- 禁止做成传统黄历网页表格
- 禁止做成普通 AI 聊天框
- 禁止重新设计另一套 UI
- 禁止堆砌廉价祥云、铜钱、八卦图标
- 禁止使用纯黑大面积文字

## 开发阶段

- **第一阶段**：只做静态 UI 和 mock data
- 不接 AI
- 不接黄历算法
- 不接后端
- 所有页面必须复用统一组件

## 组件复用

所有页面必须使用以下统一组件构建：
- `AppShell`
- `TopHero`
- `DateCard`
- `FateCard`
- `BasisCard`
- `YiJiPanel`
- `OracleCard`
- `BottomNav`

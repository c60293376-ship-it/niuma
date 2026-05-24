---
name: niuma-ui-design
description: 用于实现「牛马命历」peach-blush 移动端 UI 的设计规范 skill
---

# 牛马命历 UI 设计 Skill

## 实现目标

- **「牛马命历」**移动端 H5 App
- 新中式但不俗气
- 粉色命历感
- 年轻化、轻幽默、适合截图传播

## 必读文件

在实现任何 UI 之前，必须先读取以下文件：

1. `DESIGN_SYSTEM.md` — 完整设计规范（颜色、字体、圆角、间距、阴影）
2. `AGENTS.md` — 跨工具项目规则
3. `docs/ui-reference/README.md` — UI 参考图说明

## 主题

必须使用 **peach-blush** 主题。所有颜色通过 Tailwind theme token 或 CSS 变量引用。

## 禁止项

- 禁止米黄色背景
- 禁止亮黄色主色
- 禁止传统黄历表格
- 禁止普通 AI 聊天框
- 禁止默认 SaaS 风
- 禁止擅自改色

## 首页组件结构

首页必须拆分为以下组件，每个组件负责自己的区域：

| 组件名 | 职责 |
|---|---|
| `AppShell` | 页面背景壳子 + 滚动容器 + 底部留白 |
| `TopHero` | 标题「牛马命历」+ 印章 + slogan + 牛马插画区 |
| `DateCard` | 公历日期 + 农历 + 干支 + 建除 pill |
| `FateCard` | 今日命格 + 命格名 + 情绪描述 |
| `BasisCard` | 命理依据：破日 + 五行 |
| `YiJiPanel` | 今日宜 / 今日忌 列表 |
| `OracleCard` | 今日神谕签文 |
| `BottomNav` | 底部 4 tab 导航 |

## 检查流程

每次实现页面前：
1. 确认已读 DESIGN_SYSTEM.md
2. 确认使用的颜色在 peach-blush 色板内
3. 确认没有触发任何禁止项
4. 确认组件已拆分，不全部写在一个文件

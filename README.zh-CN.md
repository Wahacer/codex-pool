# codex-pool

[English](./README.md) | 简体中文

面向 Codex CLI 的本地优先多账号调度与上下文接力工具，支持原生 ChatGPT 登录和配额感知仪表盘。

## 项目简介

`codex-pool` 是一套面向高强度 Codex CLI 使用场景的本地优先工具链，用来管理多个 ChatGPT 账号下的工作连续性。

当前设计围绕四个核心目标展开：

- 保持原生 `Sign in with ChatGPT` 的账号使用方式
- 按 workspace 维护 handoff 和记忆
- 支持配额感知的本地调度
- 提供本地 dashboard 统一查看和操作账号池

## 常用命令

```bash
pnpm install
pnpm test
pnpm --filter @codex-pool/dashboard dev
pnpm --filter @codex-pool/dashboard build
```

## 模块结构

- `packages/shared`：运行时路径与配置辅助
- `packages/core`：账号仓储、选择逻辑、handoff、配额解析、事件记录
- `apps/cli`：原生 `codex` 启动包装层
- `apps/dashboard`：本地 Next.js 仪表盘与 API 路由

## 运行时状态目录

运行时状态不放在仓库里，而是放在 `~/.codex-pool` 下。

推荐目录结构：

```text
~/.codex-pool/
├── accounts/
├── logs/
├── state/
└── workspaces/
```

## 当前进度

当前仓库已经具备第一阶段可运行基础：

- 核心包已有测试覆盖
- dashboard 骨架可构建
- launcher 骨架可运行

下一阶段会继续把真实账号池状态和基于浏览器 profile 的额度刷新接入 dashboard 与 launcher。

## 致谢

感谢 `openai@gpt-5.4` 提供设计与实现协助。

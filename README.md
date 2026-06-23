# Workspace (Template)

多專案 **workspace（傘狀／meta）儲存庫**通用模板。本 repo 本身**不含**任何子專案原始碼，僅統一管理跨專案共用的設定與文件：

- 共通 AI 開發規範（`AGENTS.md`，唯一事實來源）與各 AI 工具的橋接設定
- VS Code 多根工作區設定（`*.code-workspace`、`.vscode/`）
- 共用文件（`docs/`）

各子專案皆為**獨立的 git repo**，於本 repo 中以 `.gitignore` 排除（傘狀模式，非 git submodule）。

> 本檔為通用模板。套用至實際專案時，請填寫下方標示 `TODO` 的處（子專案清單、來源等），並可重新命名 `workspace.code-workspace`。

## 目錄結構

```
<workspace>/                      # 本 workspace repo 根目錄
├── AGENTS.md                     # 通用 AI 開發規範（唯一事實來源）
├── CLAUDE.md                     # Claude Code 橋接檔（以 @AGENTS.md 匯入）
├── README.md                     # 本說明文件
├── workspace.code-workspace      # VS Code 多根工作區設定
├── .vscode/
│   └── settings.json             # 啟用 Copilot 讀取 AGENTS.md
├── .github/
│   └── copilot-instructions.md   # Copilot 橋接指引（指向 AGENTS.md）
├── .claude/
│   └── agents/                   # 專案專屬 Claude Code 子代理（依需要新增）
├── docs/                         # 共用文件
│
└── （以下為各自獨立的 git repo，未納入本 repo）
    ├── <子專案A>/
    └── <子專案B>/
```

## 子專案來源

<!-- TODO: 套用至實際專案時，填寫各子專案的資料夾名稱、說明與 remote URL。 -->

複製本 workspace 後，需另外於對應資料夾名稱下 clone 各子專案：

| 資料夾 | 說明 | Remote |
|--------|------|--------|
| `<子專案A>` | _（待填）_ | `<git remote url>` |
| `<子專案B>` | _（待填）_ | `<git remote url>` |

> 註：本 repo 採傘狀模式而非 git submodule，故 clone 本 repo **不會**自動帶下子專案，需各自 clone。

## 環境設定

1. Clone 本 workspace repo。
2. 於本根目錄下，依上表逐一 clone 各子專案（資料夾名稱需與 `.gitignore` 中的排除項一致，才會被正確排除）。
3. 以 VS Code 開啟 `workspace.code-workspace`（多根工作區，一次載入所有子專案）。

## AI 輔助工具設定

本專案的開發規範統一維護於 **`AGENTS.md`**，並透過下列橋接讓各工具自動讀取：

| 工具 | 讀取方式 |
|------|---------|
| Claude Code | 讀 `CLAUDE.md`，其內以 `@AGENTS.md` 匯入（Claude Code 不原生讀 AGENTS.md） |
| GitHub Copilot (VS Code) | `.vscode/settings.json` 已設 `chat.useAgentsMdFile: true`，自動讀 `AGENTS.md` |
| Cursor / Codex / Gemini CLI 等 | 多數原生讀取根目錄 `AGENTS.md` |

⚠️ 所有規範變更請**只修改 `AGENTS.md`**，其餘檔案僅為橋接，請勿重複維護以免內容漂移。

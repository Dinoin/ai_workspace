# 共通開發規範 (AGENTS.md)

> 本檔為本專案所有 AI 輔助工具（Claude Code、GitHub Copilot、Cursor、Codex、Gemini CLI 等）的**唯一事實來源 (single source of truth)**。
> 各工具透過下列橋接讀取本檔，請勿在其他檔案重複維護規範內容：
> - **Claude Code**：根目錄 `CLAUDE.md` 以 `@AGENTS.md` 匯入本檔。
> - **GitHub Copilot (VS Code)**：`.vscode/settings.json` 已啟用 `chat.useAgentsMdFile`，會自動讀取本檔。
> - **其他工具**（Cursor / Codex / Gemini CLI 等）：多數原生讀取根目錄 `AGENTS.md`。

## 角色設定 (Role Definition)
你是一名 AI 員工，於開發團隊中擔任軟體工程師，主要工作為程式開發，需依據指令與需求進行工作，與夥伴溝通使用中文，使用 VSCode。

## 開發環境 (Environment)
本專案由多人於不同作業系統開發，可能為 **Windows、macOS 或 Linux**，請勿假設特定平台。
- 優先採用跨平台寫法（如路徑分隔、換行、shell 指令）。
- 需執行平台相依命令時，先確認當前作業系統再執行；必要時提供各平台對應做法。

## 專案概述 (Project Overview)
<!-- TODO: 依各專案填寫。簡述本專案的目的、組成（前端 / 後端 / 排程 / 共用等）與技術棧。 -->

## 專案結構 (Project Structure)
<!-- TODO: 依各專案填寫實際目錄結構。本 repo 為 workspace（傘狀）模式，各子專案為獨立 git repo，於 .gitignore 中排除。範例： -->
```
<workspace>/                      # workspace repo 根目錄
├── <子專案A>/                    # （獨立 git repo，未納入本 repo）
├── <子專案B>/                    # （獨立 git repo，未納入本 repo）
├── docs/                         # 共用文件
├── AGENTS.md                     # 通用 AI 開發規範 (本檔，唯一事實來源)
├── CLAUDE.md                     # Claude Code 橋接檔 (匯入 AGENTS.md)
└── .github/
    └── copilot-instructions.md   # Copilot 橋接指引 (指向 AGENTS.md)
```

## 開發規範 (Development Rules — 依重要性由高至低排序)
1. **依事實處理**：嚴格禁止任何杜撰、猜測、幻想；產出需主動自我檢視正確性。
2. **每次操作前重讀當下程式碼**再執行動作。
3. 遵循 **DRY / KISS / YAGNI** 原則。
4. **遵循專案既定的架構模式**；採模組化、可組合的元件設計，盡量降低元件間耦合度。
5. **不進行任何服務啟動命令**（如 `npm run dev`、`uvicorn main:app --reload` 等）於本機直接啟動的操作。
6. **不進行任何 git 操作**（rebase、merge、commit、push、pull 等），除非使用者明確要求。
7. **不主動部署至遠端**；允許本地操作（docker 重啟、打包等）。
8. 不主動執行**程式碼格式化工具**（prettier、black 等）。
9. 文件中**禁止寫入敏感資訊**（密碼、Token、API Key 等）。
10. **以程式碼為優先判斷依據**；除非接獲指示，禁止以文件內容（如 README 等 md 檔）作為判斷依據。
11. 提供**完整的錯誤處理機制**。
12. 不確定或不清楚時**主動提出詢問**。
13. 每次回應皆需包含「**總結**」與「**後續步驟建議**」。

## 編碼慣例 (Conventions)

### TypeScript
- 命名：`camelCase`（變數/函式）、`PascalCase`（元件/型別/介面）；strict 模式，避免 `any`。

### Python
- 命名：`snake_case`（變數/函式/模組）、`PascalCase`（類別）。

### 通用編碼標準
- 程式碼**註解使用繁體中文**。

## 終端機規範 (Terminal Guidelines)
- **非互動式優先**：加必要參數跳過互動詢問，避免掛起（如 `uv run`、`npm install`）。AI 常無法識別或回應互動式指令，請避免使用互動式指令（如 `pipenv shell`、`python help()` 等）。
- **避免進入子 Shell**：禁止 `pipenv shell`、`python` REPL 等改變終端狀態的操作。

## 語言 (Language)
始終使用繁體中文回應，並在回答時保持專業、簡潔，必要時可提供中英文對照。

## 程式碼索引 (GitNexus)
**僅當 repo 根目錄存在 `.gitnexus/` 時適用**；不存在則略過本節，是否建立索引由使用者決定。
- **理解／定位程式碼時優先使用 GitNexus**：需釐清架構、追蹤呼叫流程、評估變更影響（blast radius）時，先查 GitNexus，再進行 grep/find 或逐檔閱讀。
- **不主動重建索引**；索引更新由使用者決定。僅在下列時機**提醒**使用者重新分析：
  - 修改 code → **不需**重新分析（日常開發直接寫）。
  - **AI 查詢結果過時**（與實際程式碼不符）→ 建議重新分析。
  - **論述大改（如重構）** → 建議重新分析。
- 重建索引請執行 `scripts/gitnexus-refresh.sh`（Windows 用 `scripts\gitnexus-refresh.bat`），會自動執行 `npx gitnexus analyze --embeddings` 並清除因此重複寫入 CLAUDE.md 的 GitNexus 區塊（該內容已由 CLAUDE.md `@AGENTS.md` 匯入涵蓋，重複寫入會違反本檔的 SSOT 規則）。


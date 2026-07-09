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
9. **變更程式碼需同步更新相關文件**，並即時更新 `docs/pending_tasks-list.md` 待辦清單。
10. 文件中**禁止寫入敏感資訊**（密碼、Token、API Key 等）。
11. **以程式碼為優先判斷依據**；除非接獲指示，禁止以文件內容（如 README 等 md 檔）作為判斷依據。
12. 提供**完整的錯誤處理機制**。
13. 反饋型需求（如指出錯誤）應**舉一反三**，主動檢查相關程式碼中是否有類似錯誤未被修正。
14. 不確定或不清楚時**主動提出詢問**。
15. **SSOT單一來源原則（Single Source of Truth）**：欄位映射、列舉值、常數等共用資料嚴禁多處硬編碼。依使用範圍決定處理方式：
    - **跨前後端／擴充套件共用** → 由**後端**定義為唯一來源，並開 API 供前端取用；前端**不得**硬編碼該資料。前端可在 store／快取存放避免重複查取。
    - **僅單一服務使用** → 可硬編碼，但須集中於**設定檔／常數模組**，避免散落於各元件。
    - 若情非得已必須各端獨立維護，務必在註解標註同步關聯檔案路徑（例：`// ⚠️ 同步更新：[service/path/to/file]`）。
16. **非程式類文檔命名**採功能優先、檔案類型次之：功能字間使用蛇形命名（全小寫底線分隔），與檔案類型之間使用 `-` 分隔，如 `user_role_permission-spec.md`（使用者_角色_權限-規格書）。
    - **文件類型詞彙表（SSOT）**：類型後綴須沿用下表既有詞彙，避免同義詞分歧（如勿再新增 `plan`/`design` 等與 `proposal`/`spec` 語意重疊的詞）。確有新類型需求時，先擴充本表再使用。

      | 類型後綴 | 中文 | 用途 |
      |---|---|---|
      | `-spec` | 規格書 | 模組/功能的正式規格：欄位定義、行為契約、實作依據（已定案或實作中） |
      | `-proposal` | 提案書 | 決策前的評估、可行性分析與建議；結論待拍板（含暫緩項目） |
      | `-reference` | 參考文件 | 工具/流程的操作參考、對照表、查詢用資料 |
      | `-list` | 清單 | 條列式追蹤（如待辦、盤點） |

    - **例外**：既有中文命名的開發者指南（如 `開發者指南-佈署更版.md`）維持原格式，屬歷史慣例，不強制改用英文後綴。
17. API 使用 **GET、POST、PATCH、DELETE** 等標準 HTTP 方法，並遵循 **RESTful** 設計原則。
18. 每次回應皆需包含「**總結**」與「**後續步驟建議**」。

## 編碼慣例 (Conventions)

### TypeScript
- 命名：`camelCase`（變數/函式）、`PascalCase`（元件/型別/介面）；strict 模式，避免 `any`。

### Python
- 命名：`snake_case`（變數/函式/模組）、`PascalCase`（類別）；所有函式須加 type hints。
- 資料庫操作一律 `async/await`（async SQLAlchemy session）。
- Schema 採 Pydantic v2 風格（`model_config`，避免 `class Config`）。
- API 回應統一 `{ data, message, code }`；時間戳記 UTC。

### Database
- 所有表格與欄位必須加 **COMMENT** 說明（用途、業務邏輯、欄位關聯）。
- 欄位排序遵循「核心資料優先、輔助資料次之」：`id`/PK 置最前，建立/更新時間置最後。

### 通用編碼標準
- 程式碼**註解使用繁體中文**。

## 終端機規範 (Terminal Guidelines)
- **非互動式優先**：加必要參數跳過互動詢問，避免掛起（如 `uv run`、`npm install`）。AI 常無法識別或回應互動式指令，請避免使用互動式指令（如 `pipenv shell`、`python help()` 等）。
- **避免進入子 Shell**：禁止 `pipenv shell`、`python` REPL 等改變終端狀態的操作。

## 語言 (Language)
始終使用繁體中文回應，並在回答時保持專業、簡潔，必要時可提供中英文對照。

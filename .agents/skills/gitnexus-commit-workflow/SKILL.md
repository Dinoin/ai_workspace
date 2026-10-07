---
name: gitnexus-commit-workflow
description: 在取得明確授權後，以 GitNexus 檢查變更影響並建立可驗證的 Conventional Commit。當使用者要求暫存、提交、檢查提交內容或準備 commit 時使用；不適用於未獲 Git 寫入授權的程式碼變更。
---

# GitNexus 提交流程

只在使用者明確要求 Git 寫入時執行。本 Skill 以 GitNexus 證據協助判斷提交範圍，不取代人工審核。

## 工作流程

1. 確認使用者已明確要求 `git add`、commit 或其他 Git 寫入操作；否則僅提供檢視與建議，不暫存或提交。
2. 重新讀取將納入提交的檔案，並檢查 `git status`、unstaged diff 與 staged diff，區分本次工作與使用者既有異動。
3. 在 commit 前執行 GitNexus `detect_changes()`；若有多個索引 repo，指定目前 repo。若報告高風險影響或受影響流程，先檢視相關流程與符號，再決定是否需要測試或拆分提交。
4. 確認提交只包含一個可獨立驗證、可安全回退的變更單位，且必要測試與直接相關文件已一併納入。
5. 僅暫存本次提交的明確檔案路徑，絕不以廣泛路徑或全部異動掩蓋使用者既有變更。
6. 依下列 Conventional Commits 格式產生訊息。
7. 建立 commit 後，回報 commit hash、實際納入檔案與驗證結果；不要自行 push、merge、rebase 或部署。

## 交付檢核

- GitNexus 影響範圍與實際 staged 檔案一致。
- 不包含未經確認的既有異動。
- 提交訊息符合專案 Conventional Commits 規範。
- 提交完成後工作樹狀態清楚，並說明任何未納入的異動。

## Commit 訊息格式

```text
<type>(<scope>): <description>

<body>

<Footer>
```

- `type` 僅使用 `feat`、`fix`、`docs`、`refactor`、`style`、`perf`、`test`、`chore`、`build`、`ci` 或 `revert`。
- `scope` 使用受影響的業務模組；全域性或沒有合適模組時可省略。
- `description` 使用英文、小寫、祈使語氣，不加句點，建議不超過 72 字元。
- `body` 視需要以繁體中文條列說明；多個條列須使用實際換行，不可寫入字面量 `\\n`。
- `Footer` 為選填，格式為 `KEY: value`。破壞性變更應在 scope 後加 `!`，並在 body 或 footer 加上 `BREAKING CHANGE:`。
- CI/CD、建置或部署自動化使用 `ci:` 或 `build:`；相依套件與雜項維護使用 `chore:`。

---
name: api-contract-conventions
description: 建立或修改 Python REST API 的端點契約、非同步資料存取與回應格式。當新增或變更路由、request/response schema、服務層或 API 錯誤處理時使用；不適用於純前端呈現或不對外的函式重構。
---

# Python REST API 契約慣例

延續現有 route、schema、service 與錯誤處理架構。

## 工作流程

1. 重新讀取受影響的路由、schema、服務、資料模型、既有端點測試與已知消費端，確認目前公開契約。
2. 依資源語意選擇標準 HTTP 方法：讀取用 `GET`、建立用 `POST`、部分更新用 `PATCH`、刪除用 `DELETE`；無法判定資源語意時先釐清需求。
3. 為所有 Python 函式、request、response 與內部服務函式提供精確 type hints；schema 採 Pydantic v2 的 `model_config`，避免 `any` 與舊式 `class Config`。
4. 所有資料庫 I/O 使用既有的 async SQLAlchemy session 與 `await`；不要在 async 路由加入同步資料庫操作。
5. 使成功與可預期錯誤回應符合 `{ data, message, code }`，並確保傳出的時間戳記為 UTC。
6. 對驗證失敗、找不到資源、權限不足、衝突與資料庫失敗等可預期路徑採用專案既有錯誤處理；避免洩漏內部實作或敏感資料。
7. 驗證端點的狀態碼、回應形狀與欄位是否相容於已知消費端，並新增或調整對應測試。

## 交付檢核

- 路徑、HTTP 方法、輸入與輸出能清楚表達資源行為。
- schema、服務與資料庫操作皆保有型別與 async 邊界。
- 所有回應均符合統一封裝，時間採 UTC。
- 錯誤情境有明確且不洩漏內部細節的處理。

![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)
# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，從基本的待辦管理開始，逐步加入主題切換、清單篩選與文字編輯等功能。專案以簡潔的介面呈現日常待辦事項，並保留使用者在瀏覽器中的資料與偏好設定。

## 線上展示

GitHub Pages：[https://andypig.github.io/20260919_Github_Copilot_workshop_Taipei/](https://<你的帳號>.github.io/<你的repo名稱>/)

> 請將上方網址中的 `<你的帳號>` 與 `<你的repo名稱>` 替換成實際的 GitHub 帳號與 Repository 名稱。

## 功能

- 新增待辦事項，空白內容不會建立項目。
- 勾選或取消勾選待辦事項，完成項目會顯示刪除線並淡化文字。
- 編輯既有待辦事項文字，支援儲存、Enter 確認與 Escape 取消。
- 刪除單筆待辦事項。
- 清空全部待辦事項。
- 顯示整體未完成項目數量，不受目前篩選條件影響。
- 清單為空或篩選結果為空時，顯示對應提示文字。
- 使用「全部」、「未完成」、「已完成」篩選待辦事項。
- 在淺色與深色模式之間切換，深色模式按鈕會顯示目前可切換的模式。
- 沒有手動選擇主題時，依照作業系統的 `prefers-color-scheme` 設定顯示。
- 使用瀏覽器 `localStorage` 保存待辦資料與手動選擇的主題偏好。
- 支援手機螢幕尺寸，並提供基本的鍵盤與 ARIA 操作資訊。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用前端框架、第三方套件或外部 CDN。
- 以 CSS 變數集中管理配色，並使用 RWD 媒體查詢支援不同螢幕尺寸。
- 透過 `localStorage` 保存待辦資料與主題偏好。
- 使用 `textContent` 與 `createElement` 產生待辦項目，避免以 `innerHTML` 組合使用者輸入內容。

## 開發方式

- 使用 GitHub Copilot Agent Mode，依照需求逐步建立與驗證待辦清單功能。
- 使用 MCP 查詢 Microsoft Learn 官方文件，了解 `prefers-color-scheme`、深色模式與色彩對比等主題。
- 使用 GitHub MCP 讀取 Repository 的 Issue，根據 Issue 內容規劃修正範圍、建立分支、提交變更並開立 Pull Request。
- 將 Issue 修復流程整理成 `.github/prompts/fix-issue.prompt.md`，讓 Agent 依照固定順序讀取 Issue、等待確認、修改、驗證、提交、推送與建立 PR。
- 透過瀏覽器實際操作驗證功能，並使用 Git 記錄每次功能或修正的變更。

## 我學到什麼

- 學會把自然語言需求拆成可驗證的介面功能與資料狀態。
- 了解如何使用 `localStorage` 保存資料，並處理無效或缺少的儲存值。
- 練習使用 GitHub Issue、分支、Commit 與 Pull Request 管理開發流程。
- 了解 MCP 如何讓 Agent 連接官方文件與 GitHub Repository 資訊。
- 學會透過專案指令檔與 Prompt 固定協作規則，讓修改範圍與驗證步驟更清楚。

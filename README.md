# A-UN OS V52 MANUAL-CONTROL (Cloudflare Pages)

## Deploy
1. リポジトリに以下の構成で配置
   - index.html
   - /css/cockpit.css
   - /js/cockpit.js

2. GitHub push（Pages 自動デプロイ）
   git add .
   git commit -m "Deploy V52 Cockpit (Pages)"
   git push

## Connection
Front -> Worker:
https://aun-os-core.3newgate.workers.dev

UI calls:
GET  /cockpit/data
POST /inject

## Success Criteria
- 画面右上 CORE: ONLINE になる
- Persona list が埋まる（STATS が返る）
- INJECT LOGIC で 200 OK（Worker -> VPS 成功）

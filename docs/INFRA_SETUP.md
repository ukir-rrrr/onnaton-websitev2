# インフラ初期設定（Supabase / Cloudflare / Resend）

登録済みの各ダッシュボードで、以下を順に実施してください。  
**APIキー・パスワードはチャットに貼らず**、ローカルの `.env.local` のみに保存します。

## 1. Supabase

1. **SQL Editor** で `supabase/schema.sql` の内容を実行
2. **Settings → API** からコピー:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`（サーバー専用・漏洩厳禁）
3. **Settings → Database** でパスワードを vault に保存
4. 制作担当を **Project Settings → Team** から Invite（Developer 以上）

### 休止防止（後で）

Cloudflare Cron から週1回 `GET /api/health` 等を叩く（Phase 5）。

## 2. Resend

1. **Domains** で送信ドメインを追加（例: `onnaton.jp`）
2. 表示された **DNS レコード** をドメイン管理側に追加
3. 認証完了後 **API Keys** を作成 → `RESEND_API_KEY`
4. 送信元: `RESEND_FROM=reservations@onnaton.jp`（認証済みドメイン）
5. 通知先: `RESEND_OWNER_TO=` オーナー or 管理会社の受信箱
6. （任意）返信先: `RESEND_REPLY_TO=` お客様自動返信の Reply-To（未設定時は `RESEND_OWNER_TO`）

※ フォーム送信時:
   - **オーナー**へ新規リクエスト通知
   - **お客様**へ受付確認の自動返信（locale に応じた文面）
   - 予約確定の確認メールは引き続きオーナーが Gmail 等から手動送信

## 3. Cloudflare

1. **Workers & Pages** で後日デプロイ（Phase 5）
2. カスタムドメインを Cloudflare に向ける
3. **Security → Settings → AI bot policies**（2026-09-15 前）  
   - Search クローラーは許可（MEO / Google 検索用）
4. 環境変数は Pages/Workers の **Settings → Variables** に `.env.example` と同じキーで設定

## 4. ローカル開発

```bash
cp .env.example .env.local
# .env.local を編集
npm run dev
```

## 5. 複数店舗を増やすとき

`sites` テーブルに行を追加（`slug`, `name`）し、各店舗用に `notices` 3行が自動で欲しい場合は schema の seed 部分を参考に INSERT。

環境変数 `SITE_SLUG` または将来のドメイン→slug マッピングで店舗を切り替えます。

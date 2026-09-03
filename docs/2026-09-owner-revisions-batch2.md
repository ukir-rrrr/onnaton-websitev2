# 2026-09 オーナー修正依頼（第2弾）— 実装指示書

Cursor クラウドエージェント向けの仕様書です。**上から順に ① → ④ → ⑤ → ⑥ → ⑦ → ⑧ → ⑨ → ⑩ → ⑪ → ⑫ を実装**してください。  
（②③は第1弾で対応済みのため本書には含めません。）

---

## 使い方（クラウドエージェント）

1. 本ファイルと **`docs/2026-09-owner-revisions.md` の「0. 前提」** を最初に読む（i18n・配色・ビルドルールはそちらを正とする）。
2. 各項目を**番号順**に実装する。
3. 作業後 **`npm run lint`** と **`npm run build`** を通す。
4. スマホ（〜639px）と PC（`xl:` 以上）で目視確認する項目を完了条件に含める。

---

## 0. クイックリファレンス

| 項目 | 種別 | 主な対象ファイル |
|---|---|---|
| ① | 全体 | `components/sections/Gallery.tsx` |
| ④ | 全体 | `components/reserve/IntlReservationForm.tsx`, `lib/i18n/copy.ts` |
| ⑤ | 全体 | `IntlReservationForm.tsx`, `lib/i18n/copy.ts`, `yue-copy.ts`, `zhTw-copy.ts` |
| ⑥ | 全体 | `IntlReservationForm.tsx`, `lib/i18n/copy.ts`, `yue-copy.ts`, `zhTw-copy.ts` |
| ⑦ | **PCのみ** | `components/sections/About.tsx` |
| ⑧ | **スマホのみ** | `components/sections/Hero.tsx`, `components/sections/About.tsx` |
| ⑨ | **スマホのみ** | `lib/i18n/copy.ts`, `components/sections/About.tsx` |
| ⑩ | **スマホのみ** | `lib/i18n/copy.ts`, `components/sections/About.tsx` |
| ⑪ | **スマホのみ** | `lib/i18n/copy.ts`, `components/sections/About.tsx` |
| ⑫ | **スマホのみ** | `components/sections/Reserve.tsx`, `lib/i18n/copy.ts` |

**海外予約ページ:** `app/reserve/intl/page.tsx` → `IntlReservationForm.tsx`  
**トップページ構成:** `app/page.tsx`（Hero → About → … → Reserve）

---

## ① ギャラリーの切り替えスピードを上げる

### 対象ファイル
- `components/sections/Gallery.tsx`

### 現状
- 無限横スクロールの自動ドリフト速度は定数 **`AUTO_SPEED = 0.018`**（px/ms）。
- `requestAnimationFrame` で `offsetRef.current -= AUTO_SPEED * dt` として移動。

### やること
- `AUTO_SPEED` を**やや大きく**する（目安: `0.024`〜`0.030` あたりから試す）。
- **速すぎて見づらくならない**範囲で調整。急加速・カクつきは避ける。
- `prefers-reduced-motion: reduce` のときは従来どおり自動スクロールしない（既存ロジック維持）。

### 完了条件
- ギャラリーが以前よりテンポよく流れる。
- ドラッグ操作・ループの継ぎ目は自然。
- reduced-motion 時は静止のまま。

---

## ④ 海外予約｜0〜5歳欄の注記を削除

### 対象ファイル
- `components/reserve/IntlReservationForm.tsx`
- `lib/i18n/copy.ts`（キー `intlForm.age0to5Note` は未使用なら削除可）

### 現状
- 0〜5歳 `<input name="age_0_5">` の**直下**に `copy.intlForm.age0to5Note` を表示している（290–292行付近）。
- 英文例: *Children aged 0-5 are generally not permitted…*

### やること
- **注記 `<span>` ブロックのみ削除**する。
- **0〜5歳の人数入力欄は残す**（送信・バリデーション仕様は変更しない）。
- 0〜5歳入力時のオーナーメール警告など、**バックエンド側の挙動は触らない**。

### 完了条件
- 4区分すべて入力欄は表示されたまま。
- 0〜5歳欄の下に注記テキストが出ない。
- 0〜5歳に 1 以上を入れても送信できる。

---

## ⑤ 海外予約｜送信ボタン下に短い注意書きを追加

### 対象ファイル
- `components/reserve/IntlReservationForm.tsx`
- `lib/i18n/copy.ts`
- `lib/i18n/locales/yue-copy.ts`, `zhTw-copy.ts`（必要なら `translations.json` → `node scripts/build-locale-files.mjs`）

### 現状
- 送信 `<button>` の直後に注意書きはない（369–375行付近）。

### やること
1. **`copy.intlForm` に新キー**（例: `submitDisclaimer`）を追加。5言語すべて。
2. 送信ボタン**すぐ下**に 2 行程度の注意書きを表示（`MultilineText` + `\n` 推奨）。
3. スタイルは周辺に合わせて控えめ（例: `text-[12px] leading-[1.75] text-cream/70 text-center sm:text-left`）。

### 文言（確定稿）

**English**
```
Submitting this form does not confirm your reservation.
Please check the confirmation email we send after reviewing your request.
```

**廣東話**
```
提交此表格並不代表預約已確認。
請確認本店審核您的預約內容後另行發送的確認郵件。
```

**繁體中文**
```
送出此表單並不代表預約已確認。
請確認本店審核您的預約內容後另行寄出的確認郵件。
```

**한국어**
```
이 양식을 제출해도 예약이 확정되는 것은 아닙니다.
예약 내용을 확인한 후 매장에서 보내드리는 확인 이메일을 반드시 확인해 주세요.
```

**日本語**（海外フォーム用。ja ロケールでも同フォームを使う場合は追加）
```
このフォームの送信時点では予約は確定しません。
内容確認後に店舗からお送りする確認メールを必ずご確認ください。
```

### 完了条件
- en / yue / zhTw / ko 各ページで、送信ボタン直下に上記注意書きが表示される。
- 送信ボタンとの余白が自然。

---

## ⑥ 海外予約｜送信完了後の説明文を更新

### 対象ファイル
- `components/reserve/IntlReservationForm.tsx`（`state.ok` 時の完了 UI — 78行付近〜）
- `lib/i18n/copy.ts` の `intlForm.successTitle` / `successBody` / `successFinalNote`
- `yue-copy.ts`, `zhTw-copy.ts`

### 現状
- 送信成功時は**インラインの完了画面**（ポップアップではなくフォーム置換）が既にある。
- ただし **`successBody` / `successFinalNote` が全ロケール英語のまま**になっている箇所がある。
- ⑤の短い注意 ↔ ⑥の詳しい説明、という**二段構え**に整理する。

### やること
1. 完了画面の文言を下記**確定稿**に差し替え（**ロケールごとに正しい言語**で）。
2. UI 構造は既存の完了画面を活かしてよい（モーダル新規作成は不要）。
3. 段落は `\n\n` で区切り、`MultilineText` で表示。

### 文言（確定稿）

#### English — `successTitle` + 本文

**Title:** `Thank you for your reservation request.`

**Body（`successBody` + `successFinalNote` に分割しても、1キーにまとめても可）:**
```
An automated email will be sent to the email address you provided.

After reviewing your request, we will send you a separate confirmation email.

Please read that email carefully and reply to us.

Once we receive your reply, we will send you a final reservation confirmation email.

Your reservation will be officially confirmed only after you receive the final confirmation email from us.
```

#### 廣東話
```
多謝您的預約申請。

系統會先向您填寫的電郵地址發送一封自動回覆郵件。

我們確認您的預約內容後，會再另外發送一封確認郵件給您。

請仔細閱讀該郵件內容，並回覆我們。

收到您的回覆後，我們會再發送最終的預約確認郵件。

只有在收到本店發出的最終預約確認郵件後，預約才正式成立。
```

#### 繁體中文
```
感謝您的預約申請。

系統會先寄送一封自動回覆郵件至您填寫的電子郵件地址。

我們確認您的預約內容後，會再另外寄送一封確認郵件給您。

請仔細閱讀該郵件內容，並回覆我們。

收到您的回覆後，我們會再寄送最終的預約確認郵件。

只有在收到本店寄出的最終預約確認郵件後，預約才正式成立。
```

#### 한국어
```
예약 요청을 보내주셔서 감사합니다.

입력하신 이메일 주소로 자동 회신 메일이 발송됩니다.

예약 요청 내용을 확인한 후, 매장에서 별도의 확인 이메일을 보내드립니다.

해당 이메일 내용을 반드시 확인하신 후 회신해 주세요.

고객님의 회신을 확인한 후, 최종 예약 확정 이메일을 보내드립니다.

매장에서 보내드린 최종 예약 확정 이메일을 받으셔야 예약이 최종 확정됩니다.
```

### 完了条件
- 送信成功後、各言語で上記の流れ（自動返信 → 確認メール → 返信 → 最終確定）が読める。
- ⑤の短い注意書きと⑥の詳細説明が役割分担されている。

---

## ⑦ PCのみ｜「恩納豚について」の文章レイアウト調整

### 対象ファイル
- `components/sections/About.tsx`（`#about-text` グリッド — 139行付近〜）

### 現状
- 左テキスト列は `xl:grid-cols-2` の左カラム。見出し・本文に `break-words` がかかっている。
- PC 幅で「唯一無二のしゃぶしゃぶ専門店です。」の**末尾1〜2文字だけ次行に落ちる**など、不自然な改行がある。

### やること（**`xl:` 以上のみ。スマホは ⑩⑪ で別対応**）
- 左テキスト列の**最大幅を広げる**（例: 親グリッド `max-w-[1200px]` の配分、列の `min-w-0` / `max-w-*` 調整）。
- 必要なら **PC のみ** 文字サイズ・`leading` を微調整。
- **右側画像とのバランス**を崩さない（画像列 `aspect-[3/4]` は維持）。

### 完了条件
- PC 表示で、句読点直前や語尾1文字だけの孤立改行が解消されている。
- スマホ表示は意図的に変えない（⑩⑪ 担当）。

---

## ⑧ スマホのみ｜Hero 予約案内文が Concept に被る

### 対象ファイル
- `components/sections/Hero.tsx`（233–239行: `ReserveButton` 下の `copy.hero.note`）
- `components/sections/About.tsx`（セクション先頭 `pt-24` 等）

### 現状
- トップ Hero の「電話で予約する」ボタン下に  
  **「完全予約制のため、ご予約は前日までにお願いいたします。」**（`copy.hero.note`）がある。
- 直下の **About（Concept）** セクションと重なり、**スマホで一部が隠れる**。

### やること（**スマホのみ** `< sm` または `< lg`）
- About（Concept）ブロック全体を**下にずらす**、または Hero 下部に**十分な padding-bottom / margin-bottom** を足す。
- Hero の absolute 配置や z-index との兼ね合いを確認し、**note 全文が読める**ようにする。
- PC レイアウトは変えない。

### 完了条件
- スマホ実機幅（375px 前後）で `hero.note` が Concept 背景・見出しに被らない。
- 「電話で予約する」ボタンとの距離感は自然。

---

## ⑨ スマホのみ｜Concept オーバーレイ見出しの改行

### 対象ファイル
- `lib/i18n/copy.ts` — `about.overlay`（日本語）
- `components/sections/About.tsx` — ヒーロー画像上の見出し（106–111行付近）

### 現状
- 日本語 `about.overlay` は1行文字列:  
  `沖縄の恵みを、極上のしゃぶしゃぶで。`
- スマホで **「しゃぶし / ゃぶで。」** のように単語途中で改行される。

### やること（**日本語・スマホのみ**）
- 改行位置を次のとおりに固定:

```
沖縄の恵みを、
極上のしゃぶしゃぶで。
```

- 実装案:
  - `about.overlay` に `\n` を入れ `MultilineText` で表示、**または**
  - `sm:` 以上では `\n` を無視 / 1行表示に戻す（`hidden sm:inline` 2要素など）。
- **他言語（en/ko/yue/zhTw）は無理に同じ改行を入れなくてよい**（日本語の見え方が主目的）。

### 完了条件
- スマホで「しゃぶしゃぶ」が途中で分断されない。
- PC では従来どおり自然な1〜2行表示。

---

## ⑩ スマホのみ｜「恩納豚について」見出しを中央寄せ＋改行

### 対象ファイル
- `lib/i18n/copy.ts` — 現 `about.lead` の**先頭1文**
- `components/sections/About.tsx` — `copy.about.lead` を使っている `h3`（151–156行付近）

### 現状
- `about.lead` に**見出し＋本文が1キー**で入っている:
  ```
  あぐー豚と沖縄三大ブランド黒毛和牛。
  沖縄が育んだあぐー豚と…
  ```
- 左寄せの `h3` として表示。

### やること（**スマホのみ**）
1. **見出し部分だけ**を分離（推奨: 新キー `about.leadHeading`）。
2. スマホでは **中央寄せ**（`text-center sm:text-left` など）。
3. 改行位置:

```
あぐー豚と
沖縄三大ブランド黒毛和牛。
```

4. PC（`sm:` / `xl:` 以上）では従来の左寄せ・改行でもよい。

### 完了条件
- スマホで見出しのみ中央、指定位置で改行。
- ⑪ の本文と視覚的に分かれている。

---

## ⑪ スマホのみ｜「恩納豚について」本文の改行整理

### 対象ファイル
- `lib/i18n/copy.ts` — 現 `about.lead` の**2文目以降**（新キー `about.leadBody` 推奨）
- `components/sections/About.tsx`

### やること（**日本語・スマホ中心**）
- 見出し下の本文を、スマホで次の改行位置になるよう調整:

```
沖縄が育んだあぐー豚と
ブランド黒毛和牛を、
数週間熟成させた恩納豚オリジナル
の出汁でいただく、唯一無二の
しゃぶしゃぶ専門店です。
```

- `\n` + `MultilineText`、または `max-w-*` + `text-balance` 等で自然に見せる。
- **PC（⑦）で広げたテキスト列**と矛盾しないよう、`sm:` 以上では改行を緩める。

### 完了条件
- スマホで指定どおりのまとまりで改行される。
- 「の出汁」「しゃぶしゃぶ」などが1文字だけ次行に落ちない。

---

## ⑫ スマホのみ｜注意事項・案内文の改行調整

### 対象ファイル
- `components/sections/Reserve.tsx` — `PolicyCard` 内の各ポリシー（children / tattoo / fragrance）
- `lib/i18n/copy.ts` — `copy.children.*`, `copy.tattoo.*`, `copy.fragrance.*`

### 現状
- `Reserve` セクション下部の案内カード3枚。
- 本文は `MultilineText` + `break-words`。**スマホで単語・文節の途中改行**や**1〜2文字の孤立行**がある。

### やること（**スマホのみ** `< sm` 中心）
- 以下の方針で**3カードすべて**を見直す:
  - 単語・フレーズの途中で改行しない
  - 1〜2文字だけ次行に落ちない
  - 意味のまとまりごとに改行（`copy.ts` に `\n` を追加）
- 必要なら `leading`・`text-[15px]`・カード内 `px-*` を微調整。
- **5言語すべて**で極端な崩れがないこと（日本語優先、他言語も確認）。

### 対象キー（最低限）
- `copy.children.lead`, `p1`, `p2`, `note`, `closing`
- `copy.tattoo.lead`, `p1`
- `copy.fragrance.lead`, `p1`

### 完了条件
- スマホ幅で3カードとも読みやすい改行。
- PC 表示は大きく崩れない。

---

## 実装時の注意（共通）

1. **i18n:** `copy.ts` の `L()` 引数順は **ja, en, ko, yue, zhTw**。yue/zhTw は `yue-copy.ts` / `zhTw-copy.ts` も更新。
2. **スマホ限定 CSS:** `max-sm:` や `sm:` プレフィックスで PC に影響を出さない（⑦は `xl:` のみ）。
3. **コミット:** 本指示書 `docs/2026-09-owner-revisions-batch2.md` もコミットに含めてよい。
4. **デプロイ:** `main` マージで Cloudflare Workers 本番デプロイが走る。PR 運用はリポジトリ慣習に従う。

---

## チェックリスト（エージェント完了報告用）

- [ ] ① ギャラリー速度 UP
- [ ] ④ 0〜5歳注記削除（入力欄は維持）
- [ ] ⑤ 送信ボタン下・短い注意（4言語＋必要なら ja）
- [ ] ⑥ 送信完了画面・詳細説明（各言語）
- [ ] ⑦ PC・恩納豚について・不自然改行解消
- [ ] ⑧ スマホ・Hero 予約案内が Concept に被らない
- [ ] ⑨ スマホ・Concept 見出し改行
- [ ] ⑩ スマホ・恩納豚見出し中央＋改行
- [ ] ⑪ スマホ・恩納豚本文改行
- [ ] ⑫ スマホ・Reserve 注意事項3カード改行
- [ ] `npm run lint` / `npm run build` 成功

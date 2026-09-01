# 2026-09 オーナー最終打ち合わせ 修正依頼（実装指示書）

このドキュメントは実装エージェント向けの単一の仕様書です。**上から順に ①〜⑭ を実装**してください。
各項目に「対象ファイル」「現状」「やること」「完了条件」を明記しています。

---

## 0. 前提（作業前に必読）

### 0-1. リポジトリの性質

- Next.js **16.3.3** / React 19 / Tailwind CSS v4 / TypeScript。**App Router**。
- **このバージョンの Next.js は学習データと API が異なる場合がある。** ルート直下 `AGENTS.md` の指示に従い、
  必要なら `node_modules/next/dist/docs/` の該当ガイドを読んでから実装すること。
- デプロイ先は **Cloudflare Workers**（`@opennextjs/cloudflare`）。Node 固有 API・生 TCP/SMTP は使えない。
  メール送信は HTTP API（Resend）経由のみ。
- DB は **Supabase**。スキーマは `supabase/schema.sql` + `supabase/migrations/`。
- `next dev` が `AGENTS.md` / `CLAUDE.md` の先頭ブロックを自動で書き戻す。差分に出たら**そのままコミットしてよい**（消すと再生成される）。

### 0-2. i18n の仕組み（最重要・ここを間違えると全部壊れる）

対応ロケールは **5つ**: `ja` / `en` / `yue`（廣東話）/ `zhTw`（繁體中文）/ `ko`（한국어）。
`lib/i18n/config.ts` の `locales` 参照。

翻訳の経路は **2系統**あり、用途が違う。

**(A) UI 文言 = `lib/i18n/copy.ts`**

```ts
// 引数の順番は ja, en, ko, yue, zhTw ← アルファベット順ではない。絶対に間違えないこと
someKey: L("日本語", "English", "한국어", "廣東話", "繁體中文"),
```

- `copy.ts` に書く **yue / zhTw の値は簡体字のダミー**。実際の表示値は
  `lib/i18n/locales/yue-copy.ts` / `zhTw-copy.ts` の `"intlForm.policyItems"` のような
  **ドット区切りキー**で上書きされる（`copy.ts` 末尾の `patchCopyYue` / `patchCopyZhTw`）。
- → **`copy.ts` にキーを追加/変更したら、yue-copy.ts と zhTw-copy.ts の該当キーも必ず追加/変更する。**
- 呼び出しはコンポーネント側で `const { t } = useT(); t(copy.intlForm.name)`、
  サーバー側で `t(locale, copy.intlForm.name)`。

**(B) 日本語ベタ書き文字列の翻訳 = `lib/i18n/phrases.ts`**

- `lib/content/*.ts`（`store.ts`, `scenes.ts`, `executiveCourse.ts` など）は日本語のまま書かれており、
  表示時に `tr()` = `phrases.ts` の辞書引きで翻訳される。**キーは日本語原文そのもの。**
- yue / zhTw は `lib/i18n/locales/yue-phrases.ts` / `zhTw-phrases.ts` が優先される。
- → **`lib/content/*` の日本語を変えたら、`phrases.ts` + `yue-phrases.ts` + `zhTw-phrases.ts` のキーも合わせて変える。**
  変えないと他言語で日本語がそのまま出る（フォールバックが原文返し）。

**(C) `lib/i18n/locales/translations.json` の扱い**

- これは `scripts/build-locale-files.mjs` の**入力**で、yue/zhTw の 4ファイルを生成する元データ。
- 実装方針: **`translations.json` を更新 → `node scripts/build-locale-files.mjs` で再生成**するのが正。
  手で `yue-copy.ts` などだけ直すと、将来の再生成で消える。
- 生成後の差分が想定通りか必ず確認すること。

### 0-3. 配色トークン（名前に騙されないこと）

`app/globals.css`。**このサイトは「和紙（明るいベージュ）背景 + 暗い文字」のライトテーマ**。
トークン名が実際の色と逆に見えるので注意。

| トークン | 実際の値 | 実際の役割 |
|---|---|---|
| `--color-ink` / `bg-ink` | `#ebe2d0` | 和紙の**明るい**背景 |
| `--color-ink-raised` / `bg-ink-raised` | `#e0d4bc` | 一段濃い和紙背景（カード・フォーム） |
| `--color-cream` / `text-cream` | `#1e1915` | **黒に近い本文文字色** |
| `--color-on-dark` / `text-on-dark` | `#f2ede6` | 写真の上に乗せる明るい文字 |
| `--color-gold` / `text-gold` | `#c9a063` | 金アクセント（⑪で扱う） |
| `--color-wipe` / `bg-wipe` | `#a68c6e` | オープニングの「肌色っぽい」レイヤー（①で扱う） |

### 0-4. 共通ルール

- **既存のデザイン・余白・タイポグラフィを崩さない。** 追加要素は周囲の Tailwind クラスの書き方に揃える。
- **5言語すべてに反映する。** 「日本語だけ直して他は後で」は不可。
- PC / スマホ両方で確認（ブレークポイントは `sm:` `lg:` `xl:` を使用中）。
- 作業後に必ず `npm run lint` と `npm run build` を通す。型エラー・lint エラーを残さない。
- DB スキーマ変更は `supabase/schema.sql` を更新し、**かつ** `supabase/migrations/` に
  日付プレフィックス付きの追加マイグレーション（`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`）を新規作成する。
  既存カラムの DROP はしない。
- 秘密情報（APIキー等）をコードに書かない。`.env.example` と `docs/INFRA_SETUP.md` にキー名だけ追記する。

---

## ① オープニングの家紋表示を 2秒 → ふわっとフェード（肌色の挟み込みを削除）

### 対象ファイル
- `lib/motion/diagonalWipe.ts`（`INTRO_LOGO_HOLD_MS`, `INTRO_WIPE_DURATION`）
- `components/hero/PageIntro.tsx`
- `components/sections/Hero.tsx`（フェーズ管理 `logo → wipeIn → wipeOut → ready`）
- `app/globals.css`（`--color-wipe`）

### 現状（原因は特定済み）
1. `lib/motion/diagonalWipe.ts` の `INTRO_LOGO_HOLD_MS = 10` → 家紋がほぼ一瞬しか出ない。
2. `PageIntro.tsx` の 2枚目のレイヤーが **`className="fixed inset-0 z-[130] bg-wipe"`**。
   `--color-wipe: #a68c6e` = これが「肌色っぽい背景」。斜めワイプでこの色が全画面を覆ってから抜けるため、
   家紋 → 肌色 → HP本体 の3段になっている。

### やること
1. `INTRO_LOGO_HOLD_MS` を **`2000`**（約2秒）にする。
2. **`bg-wipe` の斜めワイプレイヤーを、オープニングから完全に削除する。**
   `PageIntro` のフェーズを `"logo" | "fadeOut" | "ready"` に単純化し、
   家紋プレート（`bg-white` の 1枚）を `opacity: 1 → 0`（**0.8〜1.0秒 / ease `[0.22, 1, 0.36, 1]`**）で
   フェードアウトさせるだけにする。下にはすでにヒーロー画像が描画済みなので、
   **家紋 → HP本体のクロスフェード**になり、中間色は一切入らない。
3. `Hero.tsx` のフェーズ遷移・`onWipeInComplete` / `onWipeOutComplete` のコールバックを新フェーズに合わせて書き換える。
   `IntroPhase` 型のエクスポートも更新。
4. 以下は**壊さないこと**:
   - `useReducedMotion()` が true のときは即 `ready`（イントロをスキップ）する現在の挙動。
   - イントロ中のスクロールロック（`wheel` / `touchmove` の `preventDefault`）。
   - `html { overflow-y: scroll; scrollbar-gutter: stable; }` によるスクロールバー由来のレイアウトジャンプ防止。
   - ヒーローコピーが `ready` で下から立ち上がる演出（`showCopy`）。フェード完了と自然につながるように
     ディレイだけ微調整してよい。
5. `CLIP_*` / `WIPE_DURATION` / `WIPE_EASE` などの斜めワイプ定数は
   **ヒーロー画像スライドショーで現役なので削除しない**（`Hero.tsx` の `incoming` スライド）。
   `INTRO_WIPE_DURATION` がイントロ専用で未使用になった場合のみ削除可。
   `--color-wipe` は `ExecutiveCourse.tsx` の `hover:bg-wipe` で使われているので**トークン自体は残す**。

### 完了条件
- トップページを開くと家紋が**約2秒**静止し、そのまま**ふわっとヒーロー画像へフェード**する。
- 家紋とヒーローの間に**肌色（#a68c6e）や白以外の色が一瞬も現れない**。
- PC / スマホ両方で確認。`prefers-reduced-motion: reduce` でイントロがスキップされる。

---

## ② 海外予約フォームに電話番号（国番号セレクト + 番号）を必須で追加

### 対象ファイル
- 新規 `lib/content/countryCodes.ts`
- `components/reserve/IntlReservationForm.tsx`
- `lib/reserve/intl-form.ts`
- `app/actions/intl-reservation.ts`
- `lib/supabase/reservations.ts`
- `lib/email/ownerNotification.ts`
- `supabase/schema.sql` + `supabase/migrations/` に新規マイグレーション
- `lib/i18n/copy.ts` + `locales/translations.json` + 再生成

### やること

**1) 国番号マスタを新規作成** `lib/content/countryCodes.ts`

**表示順は下記のとおり固定**（アルファベット順に並べ替えない）。
**United States と Canada はどちらも `+1` なので、`dial` をキーにしてはいけない。`id` を一意キーにする。**

```ts
export interface CountryDialCode {
  id: string;   // 一意キー。フォームの value。
  name: string; // 表示名（英語）
  dial: string; // "+1" 形式
}

export const countryDialCodes: CountryDialCode[] = [
  { id: "US", name: "United States",  dial: "+1"   },
  { id: "HK", name: "Hong Kong",      dial: "+852" },
  { id: "TW", name: "Taiwan",         dial: "+886" },
  { id: "KR", name: "South Korea",    dial: "+82"  },
  { id: "CN", name: "China",          dial: "+86"  },
  { id: "TH", name: "Thailand",       dial: "+66"  },
  { id: "SG", name: "Singapore",      dial: "+65"  },
  { id: "AU", name: "Australia",      dial: "+61"  },
  { id: "MY", name: "Malaysia",       dial: "+60"  },
  { id: "ID", name: "Indonesia",      dial: "+62"  },
  { id: "PH", name: "Philippines",    dial: "+63"  },
  { id: "VN", name: "Vietnam",        dial: "+84"  },
  { id: "IN", name: "India",          dial: "+91"  },
  { id: "CA", name: "Canada",         dial: "+1"   },
  { id: "GB", name: "United Kingdom", dial: "+44"  },
  { id: "FR", name: "France",         dial: "+33"  },
  { id: "DE", name: "Germany",        dial: "+49"  },
  { id: "IT", name: "Italy",          dial: "+39"  },
  { id: "ES", name: "Spain",          dial: "+34"  },
];

export function findCountryDialCode(id: string): CountryDialCode | undefined { /* ... */ }
```

**2) フォーム UI**（`IntlReservationForm.tsx`）

- 配置は **Email の直下**（`details` fieldset 内、`sm:col-span-2`）。
- **国番号とローカル番号を別入力**にする。1行の中で左に `<select>`、右に `<input type="tel">`。
  - `<select name="phone_country">` … `option` の表示は `` `${name} (${dial})` `` （例: `United States (+1)`）。
    初期値は空の placeholder option（`value=""`、`disabled` の「Select country code」）。`required`。
  - `<input type="tel" name="phone_national" inputMode="tel" autoComplete="tel-national" required maxLength={20}>`
- スタイルは既存の `fieldClass` / `labelClass` をそのまま使う。
  select はネイティブ `<select>` でよいが、`fieldClass` を当てて他の入力と見た目を揃える。
  レイアウトは `grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-3` 程度、
  スマホでは `grid-cols-1` に落として縦積みにする（横がはみ出さないこと。親に `overflow-x-clip` があるので
  はみ出しは見た目上クリップされてしまう＝バグに気づけない。実機幅 320px で確認）。
- ラベルは i18n（下記 5)）。必須なので `*` 付き。

**3) 型・FormData パース**（`lib/reserve/intl-form.ts`）

`IntlReservationFormValues` に追加:
```ts
phoneCountry: string;   // "US"
phoneNational: string;  // "2125550123"
```
`defaultIntlReservationFormValues` は両方 `""`。
`valuesFromIntlFormData` で `phone_country` / `phone_national` を読む。
※ この型はエラー時の入力値復元に使われているので、必ず両方追加すること。

**4) サーバー側バリデーション**（`app/actions/intl-reservation.ts`）

- `phoneCountry` が `countryDialCodes` に存在する `id` であること。なければ `copy.intlForm.errorPhone`。
- `phoneNational` は数字・空白・ハイフン・括弧のみ許可。**数字だけ抽出して 6〜15桁**。
  範囲外なら `copy.intlForm.errorPhone`。
- 必須チェック（`!name || !email || ...`）の条件に電話番号を追加。
- 保存する値は 3つ:
  - `phoneCountry`: `"US"`
  - `phoneCountryCode`: `"+1"`（`findCountryDialCode` から解決）
  - `phoneNational`: 正規化後（数字のみ、または入力そのまま。**どちらでもよいが統一する**）
  - E.164 相当の表示用文字列 `"+1 2125550123"` はメール本文生成時に組み立てる（DB に重複保存しない）。

**5) i18n**（`copy.ts` の `intlForm` に追加。`errorPhone` は `copy.form` に既存だが `copy.intlForm` には無いので新規追加）

```
phone:          ja「電話番号」   / en「Phone number」        / ko「전화번호」      / yue「電話號碼」      / zhTw「電話號碼」
phoneCountry:   ja「国番号」     / en「Country code」        / ko「국가번호」      / yue「國家代碼」      / zhTw「國碼」
phoneCountryPh: ja「選択してください」/ en「Select country code」/ ko「국가번호 선택」/ yue「請選擇國家代碼」/ zhTw「請選擇國碼」
errorPhone:     ja「電話番号をご確認ください。」/ en「Please enter a valid phone number.」
                / ko「전화번호를 확인해 주세요.」/ yue「請輸入有效嘅電話號碼。」/ zhTw「請輸入有效的電話號碼。」
```
`translations.json` に追記 → `node scripts/build-locale-files.mjs` で yue/zhTw を再生成。

**6) DB**

`reservation_requests` に追加（新規マイグレーション + `schema.sql` 更新）:
```sql
alter table public.reservation_requests
  add column if not exists phone_country text,
  add column if not exists phone_country_code text,
  add column if not exists phone_national text;
```
`lib/supabase/reservations.ts` の `IntlReservationInput` と `insert()` に 3項目を追加。

**7) オーナー通知メール**（`lib/email/ownerNotification.ts`）

`メール:` の下に追加:
```
電話番号: +1 2125550123 （United States）
```

### 完了条件
- 国番号未選択・番号未入力では送信できず、フォーム内エラー文が表示言語で出る。
- 送信後、Supabase に 3カラムが入り、オーナー通知メールに `+国番号 番号（国名）` が載る。
- スマホ幅 320px で select + input が横にはみ出さない。

---

## ③ 人数入力を年齢別 4区分に変更

### 対象ファイル
②と同じ一式（フォーム / 型 / action / DB / オーナーメール / i18n）

### 現状
`adults`（1〜20）と `children`（0〜10）の 2つの `<input type="number">`。
`IntlReservationForm.tsx` の `visit` fieldset 内、`app/actions/intl-reservation.ts` の `parseCount`。

### やること

**1) 区分を 4つに**

| フォーム名（FormData） | 表示 | 範囲 |
|---|---|---|
| `adults`     | 大人           | 1〜20 |
| `age_0_5`    | 0歳〜5歳       | 0〜10 |
| `age_6_12`   | 6歳〜12歳      | 0〜10 |
| `age_13_19`  | 13歳〜19歳     | 0〜10 |

- UI は**現状と同じ `<input type="number">` を4つ**（人数を入力・選択できる仕様を維持）。
  `sm:grid-cols-2` のグリッドに素直に並べる。
- 型 `IntlReservationFormValues` の `children` を削除し、`age0to5` / `age6to12` / `age13to19` を追加。
  デフォルトは `adults: "2"`、年齢3区分は `"0"`。

**2) 0〜5歳の扱い（ここが要件の核心）**

- **0〜5歳が 1名以上でも、予約リクエストは必ず送信できるようにする。バリデーションで弾かないこと。**
  （複数回来店の常連などを特例で受け入れる場合があるため、可否はオーナーがメールで判断する）
- ただしフォーム上の 0歳〜5歳 入力欄の**直下に注意書き**を出す（5言語）:
  ```
  ja:   ※未就学児（0〜5歳）のお子様は、原則ご入店いただけません。ご入力いただいた場合も
        リクエストは送信できますが、受け入れ可否はメールにてご案内いたします。
  en:   *Children aged 0-5 are generally not permitted. You may still submit your request;
        we will let you know by email whether we can accommodate them.
  ko:   ※0~5세 어린이는 원칙적으로 입장하실 수 없습니다. 입력하셔도 요청은 전송되며,
        수용 가능 여부는 이메일로 안내드립니다.
  yue:  ※0至5歲嘅小朋友原則上恕不招待。即使填寫亦可提交申請，能否接待會以電郵通知。
  zhTw: ※0至5歲的孩童原則上恕不接待。即使填寫仍可送出申請，能否接待將以電子郵件通知。
  ```
  copy キー例: `copy.intlForm.age0to5Note`。スタイルは既存の
  `text-[12px] leading-[1.7] text-cream/70`（周辺のヒント文と同系）に合わせる。

**3) 合計人数チェック**

`adults >= 1` は維持。総人数（4区分の合計）が 1 未満にならないこと。上限は既存どおり緩めでよい。

**4) DB**

```sql
alter table public.reservation_requests
  add column if not exists age_0_5   smallint not null default 0 check (age_0_5   >= 0),
  add column if not exists age_6_12  smallint not null default 0 check (age_6_12  >= 0),
  add column if not exists age_13_19 smallint not null default 0 check (age_13_19 >= 0);
```
既存の `children smallint not null default 0` は **DROP せず**、
互換のため `children = age_0_5 + age_6_12 + age_13_19` を入れる（NOT NULL 制約を満たすため）。

**5) オーナー通知メール**（`lib/email/ownerNotification.ts`）

人数欄を差し替え:
```
大人: 2 名
0〜5歳: 1 名
6〜12歳: 0 名
13〜19歳: 0 名
```
**さらに `age_0_5 > 0` のときはメール本文の冒頭（1行目の直後）に警告行を差し込む:**
```
【要確認】0〜5歳のお子様 1 名を含むリクエストです。受け入れ可否をご判断のうえ、
お客様へのご返信でご案内ください。
```
件名の末尾にも `【0〜5歳あり】` を付けると気づきやすい（推奨）。

**6) i18n**

`copy.intlForm.children` / yue・zhTw の `"intlForm.children"` を削除し、
`adults` / `age0to5` / `age6to12` / `age13to19` / `age0to5Note` を追加:
```
adults:    ja「大人」       / en「Adults」     / ko「성인」    / yue「大人」    / zhTw「大人」（既存のまま）
age0to5:   ja「0歳〜5歳」   / en「Ages 0-5」   / ko「0~5세」   / yue「0至5歲」  / zhTw「0至5歲」
age6to12:  ja「6歳〜12歳」  / en「Ages 6-12」  / ko「6~12세」  / yue「6至12歲」 / zhTw「6至12歲」
age13to19: ja「13歳〜19歳」 / en「Ages 13-19」 / ko「13~19세」 / yue「13至19歲」/ zhTw「13至19歲」
```

### 完了条件
- 4区分がすべて表示され、それぞれ人数を入力できる。
- **0〜5歳に 1 を入れても送信が成功する**（エラーにならない）。
- Supabase に 4区分が保存され、オーナー通知メールに 4行 + 0〜5歳ありの警告が出る。

---

## ④ 「当店を何で知ったか」のアンケート項目を追加

### やること

**1) マスタを新規作成** `lib/content/referralSources.ts`

**表示順は下記のとおり固定。**
```ts
export const referralSourceIds = ["repeater", "sns", "internet", "referral"] as const;
export type ReferralSourceId = (typeof referralSourceIds)[number];
export function isReferralSourceId(v: string): v is ReferralSourceId { /* ... */ }
```

**2) i18n**（`copy.intlForm.referral*`）

```
referralLabel:
  ja「当店を何でお知りになりましたか」/ en「How did you hear about us?」
  / ko「저희 매장을 어떻게 알게 되셨나요?」/ yue「您係點樣得知本店？」/ zhTw「您是如何得知本店的？」
referralPh:
  ja「選択してください」/ en「Please select」/ ko「선택해 주세요」/ yue「請選擇」/ zhTw「請選擇」

repeater: ja「リピーター」    / en「I'm a returning guest」   / ko「재방문 고객」 / yue「回頭客」   / zhTw「回頭客」
sns:      ja「SNS」           / en「Social media」            / ko「SNS」        / yue「社交媒體」 / zhTw「社群媒體」
internet: ja「インターネット」 / en「Internet search」          / ko「인터넷」      / yue「網上搜尋」 / zhTw「網路搜尋」
referral: ja「知人の紹介」    / en「Recommended by someone」  / ko「지인 소개」   / yue「朋友介紹」 / zhTw「朋友介紹」
```

**3) フォーム UI**

- `<select name="referral_source" required>`（プルダウン）。初期値は空 placeholder。
- 配置は **国・地域（country）の直下**、最後の fieldset 内。
- **必須項目として実装する。**（オーナーがデータを取りたい項目のため。任意に変えたい場合は
  `required` を外し、サーバー側の必須チェックから除くだけで済むようにしておく）

**4) サーバー / DB / メール**

- `app/actions/intl-reservation.ts`: `isReferralSourceId()` で検証。不正なら `copy.intlForm.errorRequired`。
- DB: `alter table public.reservation_requests add column if not exists referral_source text;`
- オーナー通知メール: `当店を知ったきっかけ: リピーター` の1行を追加（**日本語表記で出す**。
  オーナーが読むメールなので、`referral_source` の id → 日本語ラベルへ変換する）。

### 完了条件
- 4択が指定の順番で表示される。未選択では送信できない。
- Supabase に id が保存され、オーナーメールに日本語ラベルで出る。

---

## ⑤ 「Requests／要望」欄を削除

### 対象ファイル
- `components/reserve/IntlReservationForm.tsx`（`intl-notes` の `<textarea>`、277〜293行付近）
- `lib/reserve/intl-form.ts`（`notes`）
- `app/actions/intl-reservation.ts`（`notes` の取得・1000文字チェック・payload）
- `lib/supabase/reservations.ts`（`notes`）
- `lib/email/ownerNotification.ts`（`備考:` の行）
- `lib/i18n/copy.ts` の `intlForm.notesHeading` / `notes` / `notesPh`
  + `locales/translations.json` + yue/zhTw 再生成

### やること
- **海外予約フォーム（`intlForm`）の要望欄のみ削除**。
- `payload.notes` は `null` を渡す。**DB の `notes` カラムは残す**（過去データが入っているため DROP しない）。
- オーナー通知メールから `備考:` の行を削除。
- `copy.intlForm.notes*` の 3キーを `copy.ts` / `translations.json` / `yue-copy.ts` / `zhTw-copy.ts` から削除。

### 注意
- **`copy.form.*`（`lib/i18n/copy.ts` 452〜613行）は別物**。これは日本語向けオンラインフォーム
  `components/reserve/ReservationForm.tsx` の文言。**こちらは触らない。**

### 完了条件
- 海外予約フォームに要望／Requests のテキストエリアが存在しない。
- `notes` 関連の未使用 import / 変数が残っていない（`npm run lint` がクリーン）。

---

## ⑥ コースページにサービス料の注記を追加

### 対象ファイル
- `components/course/ExecutiveCourse.tsx`（`CourseDetail`。`ReserveButton` は末尾付近）
- `app/course/page.tsx`
- `lib/i18n/copy.ts` の `coursePage`

### 現状
`app/course/page.tsx` が `courseMenus`（`lib/content/executiveCourse.ts` 310行〜）を map して
`CourseDetail` を5枚描画する。**最後の要素は `chateaubriandCourse`（`id: "chateaubriand"`、
`name: "エグゼクティブ極"` + `nameTategakiRest: "（with シャトーブリアン）"`）**。
`CourseDetail` 内の `<div className="mt-10 flex justify-center ...">` に `ReserveButton` がある。

### やること
1. `copy.coursePage.serviceFee` を追加（5言語）:
   ```
   ja:   ※サービス料として5％を頂戴しております。現金でお支払いの場合はサービス料を免除いたします。
   en:   *A 5% service charge applies. The service charge is waived for cash payments.
   ko:   ※서비스 요금으로 5%를 받고 있습니다. 현금으로 결제하시는 경우 서비스 요금은 면제됩니다.
   yue:  ※本店收取 5% 服務費。以現金付款則豁免服務費。
   zhTw: ※本店收取 5% 服務費。若以現金付款，則免收服務費。
   ```
2. `CourseDetail` に `showServiceFeeNote?: boolean` を追加し、true のとき
   **`ReserveButton` の直下**に注記を描画する。
3. `app/course/page.tsx` で `showServiceFeeNote={i === courseMenus.length - 1}` を渡す
   → 最後（エグゼクティブ極 with シャトーブリアン）にだけ出る。
4. スタイル: コースページは `main.font-brush-jp`（筆書体）配下。周囲に合わせて
   `mt-5 text-center text-[13px] leading-[1.9] tracking-[0.08em] text-cream/85 sm:text-[14px]` 程度。
   中央寄せ、`max-w-[36rem] mx-auto` で行長を抑える。

### 完了条件
- コースページ最下部、エグゼクティブ極（with シャトーブリアン）の「電話で予約する」ボタンの下に注記が出る。
- 他の4コースには出ない。
- 5言語すべてで表示され、はみ出し・改行崩れがない。

---

## ⑦ 海外予約ページ「ご予約前にご確認ください」の内容を差し替え

### 対象ファイル
- `lib/i18n/copy.ts` の `intlForm.policyHeading` / `intlForm.policyItems`
- `lib/i18n/locales/translations.json` → 再生成で `yue-copy.ts` / `zhTw-copy.ts`
- `app/reserve/intl/page.tsx`（`policyBullets()`）

### 現状
`policyItems` は **`\n` 区切りの1本の文字列**。`app/reserve/intl/page.tsx` の `policyBullets()` が
`\n` で split して `<ul><li>` にする。そのため `※`／`*` で始まる注記行も箇条書きの「点」付きで出てしまう。

### やること

**1) `policyHeading` を差し替え**
```
ja:   ご予約前にご確認ください
en:   Before you apply
ko:   예약 전 반드시 확인해 주세요
yue:  預約前請先確認
zhTw: 預約前請先確認
```

**2) `policyItems` を差し替え**（各行 `\n` 区切り。行の順番も厳守）

`ja`（日本語ページおよび⑭で再利用する正本）:
```
当店は完全予約制です。
ご予約は、ご希望日の1か月前から承っております。1か月より先の日程のご予約は受け付けておりません。
ご予約はコース料理のみ承っております。
コースは18:00より一斉スタートとなります。21:00閉店です。
お出汁は最初は少し辛めですが、お肉やお野菜を入れていくことで、驚くほど甘くまろやかな味わいへと変化します。お子様でも召し上がれるほどまろやかになりますが、辛いものが極度に苦手な方はご遠慮ください。
お出汁の変更はできません。
お出汁のレシピの都合上、アレルギー対応は行っておりません。
未就学児のお子様はご入店いただけません。
タトゥーは見えないように隠していただきますようお願いいたします。
※ワンポイント程度の小さなタトゥーは問題ございません。
```

`en`:
```
We are a reservation-only restaurant.
Reservations are accepted from one month before your preferred visit date. We do not accept reservations for dates more than one month in advance.
Reservations are accepted for course menus only.
All courses start at 6:00 PM. The restaurant closes at 9:00 PM.
Our dashi broth is slightly spicy at first, but as meat and vegetables are added, it becomes surprisingly sweet and mild. It becomes mild enough for children to enjoy, but if you are extremely sensitive to spicy food, please refrain from making a reservation.
The dashi broth cannot be changed.
Due to the ingredients and recipe used for our dashi broth, we are unable to accommodate food allergies.
Preschool-age children are not permitted to enter the restaurant.
Please keep tattoos covered while inside the restaurant.
*Small tattoos are permitted.
```

`yue`（廣東話）:
```
本店只接受預約客人。
預約由到訪日期前一個月起開始接受。恕不接受超過一個月後的預約。
預約只限套餐。
所有套餐統一於下午6時開始，本店於晚上9時關門。
湯底一開始會帶少許辣味，但加入肉類及蔬菜後，味道會變得令人驚喜地香甜柔和，甚至小朋友亦能享用。不過，如您非常不喜歡辣味，敬請不要預約。
湯底恕不能更改。
由於湯底的配方及所使用的食材，本店未能提供食物敏感或過敏方面的個別處理。
學齡前兒童恕不招待。
敬請將紋身遮蓋，避免外露。
※細小的紋身則沒有問題。
```

`zhTw`（繁體中文）:
```
本店採完全預約制。
預約自預計來店日前一個月起開放。恕不接受超過一個月後的預約。
僅接受套餐預約。
所有套餐統一於下午6:00開始，本店於晚上9:00閉店。
湯底一開始會帶有些許辣味，但加入肉品與蔬菜後，會逐漸變得令人驚喜地甘甜溫潤，甚至小朋友也能享用。不過，若您非常不耐辣，敬請勿預約。
湯底恕無法更換。
由於湯底的配方及使用食材，本店無法提供食物過敏的個別處理。
恕不接待學齡前兒童。
請將刺青遮蓋，避免外露。
※小面積的刺青則沒有問題。
```

`ko`（한국어）:
```
저희 매장은 완전 예약제로 운영됩니다.
예약은 방문 희망일 1개월 전부터 가능합니다. 1개월을 초과한 날짜의 예약은 받지 않습니다.
예약은 코스 요리만 가능합니다.
모든 코스는 오후 6시에 일괄 시작하며, 오후 9시에 영업을 종료합니다.
육수는 처음에는 약간 매콤하지만, 고기와 채소를 넣어 드실수록 놀라울 정도로 달고 부드러운 맛으로 변합니다. 어린이도 먹을 수 있을 정도로 순해지지만, 매운맛을 극도로 어려워하시는 분은 예약을 삼가 주시기 바랍니다.
육수는 변경할 수 없습니다.
육수의 레시피와 사용 재료 특성상 알레르기 개별 대응은 어렵습니다.
미취학 아동은 입장하실 수 없습니다.
문신은 보이지 않도록 가려 주시기 바랍니다.
※작은 크기의 문신은 괜찮습니다.
```

**3) `※` / `*` 行を箇条書きから外す**

`app/reserve/intl/page.tsx` の `policyBullets()` を改修し、戻り値を
`{ bullets: string[]; notes: string[] }` にする。
- `※` または `*` で始まる行 → `notes`
- それ以外 → `bullets`

`IntlReserveMain` の `policies` prop の型を合わせ、`<ul>` の**下**に `notes` を
`text-[13px] text-cream/75`（点なし・インデントなし）の段落として描画する。

**この分割ロジックは⑭でも使うので `lib/content/reservationPolicy.ts` などに切り出して共有する。**

**4) 各行が長いのでレイアウト確認**

5行目（お出汁の説明）は非常に長い。`<li>` は `max-w-2xl` + `leading-[2]` なので折り返しは問題ないが、
**スマホ幅で `break-keep` による横はみ出しが起きないこと**を確認する（`MultilineText` のデフォルトは
`keepAll=true` = `sm:break-keep`。長い日本語1文なので `keepAll={false}` にするのが安全）。

### 完了条件
- 5言語すべてで指定どおりの見出し・10行が表示される。
- `※` / `*` の行が箇条書きの点なしで、リストの下に注記として出る。
- スマホ 320px 幅で横スクロール・文字切れが発生しない。

---

## ⑧ 海外予約リクエスト送信時の自動返信メールを「全ロケール英語」の指定文面に

### 対象ファイル
- `lib/email/customerAutoReply.ts`
- `lib/i18n/copy.ts` の `intlAutoReply`（削除）
- `lib/i18n/locales/translations.json` / `yue-copy.ts` / `zhTw-copy.ts`（該当キー削除）

### 現状
`sendCustomerAutoReply()` が `input.locale` からロケールを決め、`copy.intlAutoReply.subject` / `.body` を
`t(locale, ...)` で引き、`{name}` `{reference}` を差し込んでいる。**送信機構（Resend）はすでに実装済みで動く。**
文面とロケール分岐だけを差し替える。

### やること

1. **ロケール分岐を撤去し、英語1本にする。** 国・地域に関係なく常に英語。
2. `copy.intlAutoReply` を `copy.ts` / `translations.json` / `yue-copy.ts` / `zhTw-copy.ts` から削除し、
   文面は `lib/email/customerAutoReply.ts` 内の定数として持つ。
3. **件名（完全一致）**
   ```
   Reservation Request Received | ONNATON
   ```
   ※ 現状の件名にある `({reference})` は**付けない**。
4. **本文（完全一致。`{name}` にフォームの「Name」を差し込む）**
   ```
   Dear {name},

   Thank you for submitting a reservation request to ONNATON.

   This is an automated reply.
   Your reservation is not confirmed yet.

   After reviewing your reservation request, the owner will send you a confirmation email manually.

   Please read that email carefully and reply to it.

   Once we receive your reply, we will send you a final reservation confirmation email.

   Your reservation will be officially confirmed only after you receive the final confirmation email from us.

   Please note that we do not accept phone reservations from international guests.

   Reservations are accepted from one month before your preferred visit date.
   We cannot accept reservations for dates more than one month in advance. Please submit your request again once the reservation period opens.

   Our emails may occasionally be filtered into your Spam, Junk, or Trash folder. If you do not receive our email, please check those folders and your email settings.

   ※This is an automated email.
   Please do not reply to this message.

   ONNATON
   ```
   - `{name}` の差し込みは既存の `fill()` ヘルパーをそのまま使う。
   - `{reference}` は本文中に**出さない**（DB とオーナー通知メールには従来どおり保持する）。
5. **既存の安全機構は維持する**:
   - `lib/security/rate-limit.ts` の `INTL_AUTOREPLY_COOLDOWN_MS` による重複送信抑止
   - `getResendReplyTo()` を `replyTo` に設定（⑨参照）
   - Resend 未設定時に `{ ok: true, skipped: true }` を返して予約自体は成功させる挙動

### 完了条件
- ロケール `en` / `yue` / `zhTw` / `ko` いずれで送信しても、**英語の同一文面**が届く。
- 宛名が `Dear <入力された名前>,` になっている。
- 件名が `Reservation Request Received | ONNATON` に完全一致。

---

## ⑨ 送信元・受信先のメールアドレス構成（結論と実装）

### 技術的な前提（これがアドレス設計を決める）

このサイトは Cloudflare Workers 上で動き、メール送信は **Resend の HTTP API**（`lib/email/resend.ts`）を使う。

- **Resend の送信元（From）に Gmail アドレスは指定できない。** Resend は自分が所有・DNS 認証した
  ドメインしか From に使えず、`gmail.com` は認証できない。
- Gmail の SMTP を直接叩く案は、**Workers ランタイムで生の SMTP が事実上使えない**ため非現実的。
- したがって **From は必ずドメインのアドレス**（例 `reservations@onnaton.com`）になる。
  ただしこれは**送信専用で、メールボックスは不要**。Resend 側で DNS レコード（SPF / DKIM）を
  設定するだけでよく、日々の管理は発生しない。

### 結論：Gmail は 1つでよい（2つに分ける必要はない）

理由は、「自動返信メールの送信元」が Gmail にはできないため、**Gmail が担う役割は受信側だけ**に絞られる。

| 役割 | 使うアドレス | 環境変数 |
|---|---|---|
| 自動返信メールの From | ドメインのアドレス（送信専用・受信箱不要） | `RESEND_FROM=reservations@onnaton.com` |
| オーナーが予約内容を受け取る宛先 | **Gmail（1つ）** | `RESEND_OWNER_TO=onnaton.reserve@gmail.com` |
| 自動返信メールの Reply-To | **同じ Gmail** | `RESEND_REPLY_TO=onnaton.reserve@gmail.com` |
| オーナーが確認メールを手動送信する時 | **同じ Gmail** | （運用のみ・設定不要） |

この1つの Gmail に集約すると、
「予約通知 → オーナーが確認メール送信 → お客様の返信 → 最終確定メール」の**やり取りが全部同じ受信箱に
1スレッドで並ぶ**ので、⑩の5段階フローの取りこぼしが起きにくい。2つに分けると通知と返信が別受信箱に
散り、確認漏れの原因になるだけでメリットがない。

### 実装タスク

1. `.env.example` のコメントを上記の役割どおりに書き換える（`RESEND_FROM` は認証済みドメイン必須、
   `RESEND_OWNER_TO` / `RESEND_REPLY_TO` は Gmail 可、と明記）。
2. `docs/INFRA_SETUP.md` の「2. Resend」を上記に合わせて更新。
   - 現状 `onnaton.jp` と書かれているが、実際のドメインに合わせる（`onnaton.com`）。
   - 「Gmail を From にはできない」理由を1行残す（将来の担当者が同じ相談を繰り返さないため）。
3. コードは**変更不要**。`getResendConfig()` / `getResendReplyTo()` / `notifyOwnerIntlReservation()` が
   すでにこの構成で動く。
4. Cloudflare ダッシュボードの Production 変数にも同じキーを設定する必要がある旨を
   `docs/INFRA_SETUP.md` に明記（`wrangler.jsonc` の `keep_vars: true` は既に入っている）。

### オーナー側で用意が必要なもの（実装者はコード変更不要、伝達のみ）
- **Gmail 1つ**（例 `onnaton.reserve@gmail.com`）
- **`onnaton.com` の DNS に Resend の SPF / DKIM レコードを追加**（送信元ドメイン認証。1回のみ）

---

## ⑩ 送信後の完了画面を「この後の流れが分かる」内容に

### 対象ファイル
- `components/reserve/IntlReservationForm.tsx`（`if (state.ok) { ... }` のブロック、76〜114行）
- `lib/i18n/copy.ts` の `intlForm.successKicker` / `successTitle` / `successBody` / `reference`

### やること

1. **表示は全ロケール英語**（オーナー指定）。ロケール分岐せず固定の英語を出す。
2. 表示文言（この順番・この区切りで）:
   ```
   Thank you for your reservation request.

   We will send an automated email to the email address you provided.

   After reviewing your request, we will send you a confirmation email.
   Please read the email carefully and reply to us.

   Once we receive your reply, we will send you a final reservation confirmation email.

   Your reservation is not confirmed until you receive the final confirmation email from us.
   ```
   最終行は**予約が未確定であることが伝わるよう強調**する（`text-gold-ink`（⑪参照）+ 上下に区切り線、
   もしくは枠付き）。ただし既存の落ち着いたトーンを崩さない。
3. 既存の見出し構造は流用してよい:
   - kicker（`REQUEST RECEIVED`）と金色の区切り線 → そのまま残す
   - `successTitle` → `Thank you for your reservation request.`
   - `successBody` → 残りの本文（`MultilineText` で `\n` を活かす）
4. **受付番号（`state.reference`）の表示ブロックは削除する**（オーナー指定の表示内容に含まれないため）。
   `reference` 自体は Supabase とオーナー通知メールで従来どおり使うので、
   サーバー側の生成ロジックは残す。
5. 「Back to top」「Make another request」のボタンは残す（英語表記のまま）。
6. 使わなくなった copy キー（`reference` など）は `copy.ts` / `translations.json` / yue / zhTw から削除。

### 参考（実装意図。画面に流れ図を描く必要はない）
```
予約リクエスト送信 → 自動返信メール → オーナーから確認メール（手動）
→ お客様が返信 → オーナーから最終確定メール → 予約確定
```

### 完了条件
- 送信成功後、上記の英語文面が全ロケールで表示される。
- 「最終確定メールを受け取るまで予約は未確定」が視覚的に目立つ。
- 受付番号が画面に出ない。オーナー通知メールには従来どおり出る。

---

## ⑪ ゴールド文字の視認性改善（サイト全体）

### 問題の実測値

- `--color-gold: #c9a063` を `--color-ink-raised: #e0d4bc`（フォーム背景）の上に置いたときの
  **コントラスト比は約 1.65 : 1**。WCAG AA の 4.5:1（通常テキスト）/ 3:1（大きい文字）を大きく下回る。
  「Name *」「Email *」などのラベルがほぼ読めないのはこれが原因。
- 一方、`bg-gold` + `text-ink`（`#c9a063` 背景に `#1e1915` 文字。送信ボタン等）は
  **約 7.2 : 1 で問題なし**。

→ **`--color-gold` を一律に暗くしてはいけない。** 暗くすると `bg-gold` のボタンが
「暗い金地 + 黒文字」になって逆に読めなくなる。

### 方針：テキスト用の金トークンを分離する

1. `app/globals.css` の `:root` に**新トークンを追加**（既存 `--color-gold` は変更しない）:
   ```css
   --color-gold: #c9a063;      /* 塗り・枠線・濃色背景上の文字用（変更なし） */
   --color-gold-ink: #74581a;  /* 和紙背景の上に置く文字・ラベル用（新規） */
   ```
   `#74581a` は `#e0d4bc` 上で **約 4.54 : 1**（AA 通常テキスト合格）。実装後に必ず実測で検証すること。
   ブランドの印象が変わりすぎる場合は `#7a5d1c`〜`#6b5116` の範囲で調整してよいが、
   **`#e0d4bc` および `#ebe2d0` の両方に対して 4.5:1 以上**を確保する。
2. `@theme inline` ブロックに `--color-gold-ink: var(--color-gold-ink);` を追加し、
   Tailwind の `text-gold-ink` / `border-gold-ink` が使えるようにする。

### 置換の判断基準（機械的に一括置換しないこと）

`grep -rn "text-gold" components app` で **18ファイル / 約46箇所**ヒットする。1件ずつ背景を見て振り分ける:

| 背景 | 対応 |
|---|---|
| 和紙背景（`bg-ink` / `bg-ink-raised` の中） | **`text-gold` → `text-gold-ink`** |
| 写真の上の暗いオーバーレイ（`bg-black/65` の中、`tone="onDark"`） | **`text-gold` のまま**（すでに十分読める） |
| `bg-gold` の上の文字 | 変更しない |
| hover 状態（`hover:text-gold`） | 和紙背景上なら `hover:text-gold-ink` |

**優先して直すべき箇所（オーナーが指摘した「Name *」「Email *」等）**:
- `components/reserve/IntlReservationForm.tsx:29` — `labelClass`（**全フォームラベルの元凶。ここが最重要**）
- `components/reserve/IntlReservationForm.tsx:79, 90, 107, 126, 220` — kicker / 受付番号 / エラー枠 / 日付ヒント
- `components/reserve/ReservationForm.tsx:27`（同じ `labelClass` パターン）と 65, 76, 93, 121, 203, 265, 304, 357, 374
- `components/reserve/IntlReserveMain.tsx:27, 47, 68`
- `components/ui/SectionEyebrow.tsx:27, 31` — セクション見出しの eyebrow と区切り線（**サイト全体に効く**）。
  現状 `tone` prop は `headingColor` にしか反映されておらず、**eyebrow の `text-gold` と
  `bg-gold/55` の区切り線は `tone` に関係なく固定**。ここを `tone` 対応にする:
  ```ts
  const eyebrowColor = tone === "onDark" ? "text-gold" : "text-gold-ink";
  const ruleColor    = tone === "onDark" ? "bg-gold/55" : "bg-gold-ink/55";
  ```
  → 写真上（`tone="onDark"`）は従来の見た目のまま、和紙背景上だけ読みやすくなる。
- `components/ui/ReserveButton.tsx:62, 115, 136`
- `components/sections/Access.tsx:59, 72, 110` / `Reserve.tsx:123, 128` / `About.tsx:123, 145` /
  `Kodawari.tsx:71, 99` / `Interior.tsx:118` / `Gallery.tsx:234` / `SiteNoticesBody.tsx:32` /
  `ReservationBanner.tsx:79` / `CourseGrid.tsx:27` / `ExtraMenu.tsx:102`
- `components/layout/Header.tsx:27, 28, 30, 371` / `LanguageFlags.tsx:60, 61, 73`
- `components/ui/DatePickerCalendar.tsx:224, 248` — カレンダーの選択日など

また `bg-gold/10` + `text-gold` のエラー枠（`IntlReservationForm.tsx:126`）は
背景がほぼ同系色なので、`text-gold-ink` + `border-gold-ink/40` にする。

### 補助手段（必要な箇所のみ）
- **写真の上**の金文字には、既に使われているパターンを踏襲:
  `[text-shadow:0_1px_3px_rgba(0,0,0,0.5)]`（`Hero.tsx` 参照）。
- **黒い縁取り（`-webkit-text-stroke`）は使わない。** 明朝系フォントで細部が潰れて品位が落ちる。
  トークン分離 + 必要箇所の text-shadow で足りる。

### 完了条件
- 海外予約フォームの「Name *」「Email *」等のラベルがはっきり読める。
- `bg-gold` のボタン（送信ボタン、Back to top など）の可読性が**悪化していない**。
- 和紙背景上の金文字すべてが 4.5:1 以上（大見出しは 3:1 以上）。
- 写真上の金文字の見た目が従来と変わっていない。
- **5言語 × 全ページ（`/`, `/course`, `/seats`, `/reserve`, `/reserve/intl`, `/admin/notices`）を目視確認。**

---

## ⑫ 最下部の定休日表記を変更

### 対象ファイル
- `lib/content/store.ts:47`（アクセス表の行）
- `lib/i18n/phrases.ts`（`"定休日"` 366行付近、および新規文言）
- `lib/i18n/locales/yue-phrases.ts:78` / `zhTw-phrases.ts:78`
- `lib/i18n/copy.ts:469`（`copy.form.closed`）と `copy.ts:623`（`copy.intlForm.closed`）
- `lib/i18n/locales/translations.json` → 再生成

### 現状
定休日表記は **3箇所**にある。全部直すこと。
1. `lib/content/store.ts:47` — `{ label: "定休日", value: "火曜日・水曜日" }`（トップ最下部のアクセス表）
2. `lib/i18n/copy.ts:469` — `copy.form.closed`（`/reserve` の日本語フォーム）
3. `lib/i18n/copy.ts:623` — `copy.intlForm.closed`（`/reserve/intl` の見出し下）

### やること

**1) `lib/content/store.ts:47` を差し替え**
```ts
{
  label: "通常定休日",
  value: "火曜日・水曜日\n※臨時営業・臨時休業については、お知らせをご確認ください。",
},
```
`components/sections/Access.tsx:80-82` は `MultilineText` で描画しているので `\n` はそのまま改行になる。
※行が長いので、`※` で始まる2行目だけ `text-[13px] text-cream/70` に落とす小改修を入れてよい
（`Access.tsx` の `<span>` 内で行を分けて描画する）。

**2) `phrases.ts` に翻訳を追加**（`tr()` は日本語原文キー引き。既存 `"定休日"` の行は残したまま追加）
```
"通常定休日":
  ja「通常定休日」/ en「Regular closing days」/ ko「정기휴일」/ yue「固定休息日」/ zhTw「固定公休日」

"火曜日・水曜日\n※臨時営業・臨時休業については、お知らせをご確認ください。":
  ja  「火曜日・水曜日\n※臨時営業・臨時休業については、お知らせをご確認ください。」
  en  「Tuesdays and Wednesdays\n*Please check our Notices for special opening or closing days.」
  ko  「화요일·수요일\n※임시 영업 및 임시 휴업은 공지를 확인해 주세요.」
  yue 「星期二、星期三\n※臨時營業或臨時休息，請參閱公告。」
  zhTw「星期二、星期三\n※臨時營業或臨時休業，請參閱公告。」
```
**注意**: `phrases.ts` の `tr()` は `phrases[ja] ?? phrases[ja.replace(/\n/g, "")]` というフォールバックを持つ。
`\n` を含むキーは**原文そのまま**（`\n` 込み）で登録するのが安全。
yue / zhTw は `yue-phrases.ts` / `zhTw-phrases.ts` にも同じキーで追加（`translations.json` 経由で再生成）。

**3) `copy.form.closed` / `copy.intlForm.closed` を差し替え**（現状は1行の「定休日：火曜日・水曜日」）
```
ja:   通常定休日：火曜日・水曜日
      ※臨時営業・臨時休業については、お知らせをご確認ください。
en:   Regular closing days: Tuesdays and Wednesdays
      *Please check our Notices for special opening or closing days.
ko:   정기휴일: 화요일·수요일
      ※임시 영업 및 임시 휴업은 공지를 확인해 주세요.
yue:  固定休息日：星期二、星期三
      ※臨時營業或臨時休息，請參閱公告。
zhTw: 固定公休日：星期二、星期三
      ※臨時營業或臨時休業，請參閱公告。
```
（`\n` 区切りの1文字列。表示側は `IntlReserveMain.tsx:64` などで、現在 `MultilineText` を通していない
`<p>{t(copy.intlForm.closed)}</p>` になっているので、**`MultilineText` に通すよう修正する**。
通さないと `\n` が無視されて1行になる）

### 完了条件
- トップ最下部のアクセス表が「通常定休日 / 火曜日・水曜日 + ※お知らせ参照」になっている。
- `/reserve` と `/reserve/intl` の定休日表記も同様に2行になっている（`\n` が改行として描画される）。
- 5言語すべてで自然な訳が出る（日本語のフォールバックが出ていないこと）。

---

## ⑬ 「ご利用シーン｜海外からのお客様」の文章見切れ修正

### 対象ファイル
- `components/sections/Scenes.tsx`（103〜105行）
- `lib/content/scenes.ts`（27〜30行）

### 原因（特定済み）
`Scenes.tsx:104` は
```tsx
<MultilineText text={tr(scene.desc)} />
```
で `MultilineText` の **`keepAll` がデフォルト `true`** → 内部で `sm:break-keep` が当たる。
`break-keep` は日本語の文中改行を禁止するため、
`"ご愛顧いただいています。"` のような長い連続した日本語が**折り返せずカード幅を超え**、
親カードの `overflow-hidden`（45行）で**横方向に切られている**。
`xl:grid-cols-4` で1枚あたりの幅が狭いので、4枚目が最も影響を受ける。

### やること
1. `Scenes.tsx:104` の説明文を **`<MultilineText text={tr(scene.desc)} keepAll={false} />`** にする
   （`keepAll={false}` → `break-words`。日本語が自然に折り返す）。
2. 同カード内の見出し `Scenes.tsx:100-102` の `<h3>{tr(scene.title)}</h3>` にも
   `min-w-0 break-words` を足して、長い訳（EN / KO）でのはみ出しを防ぐ。
3. 説明文の高さ制約 `min-h-[2lh]`（103行）は **`min-h` なので3行になっても伸びる**が、
   カードは `h-[320px] sm:h-[380px] xl:h-[420px]` の固定高。テキストブロックは
   `absolute inset-x-6 bottom-6` で下端固定なので上方向に伸びる。3行になっても収まることを確認する。
   収まらない場合は `inset-x-5`（左右余白を詰める）または `text-[12px] sm:text-[13px]` に落とす。
4. `lib/content/scenes.ts:28` の手動改行
   `"世界各国からのお客様に\nご愛顧いただいています。"` は、`keepAll={false}` で自然折り返しに
   任せるなら **`\n` を外して1文にしてよい**（`"世界各国からのお客様にご愛顧いただいています。"`）。
   外す場合は `phrases.ts:667` のキーが `\n` なしの原文と一致しているか確認する
   （現状 `phrases.ts` のキーは `\n` なし版で登録済み。`tr()` の `replace(/\n/g, "")`
   フォールバックで引けているだけなので、`\n` を外すと素直に一致する）。
5. **同じ問題が周辺にないか確認する。** `keepAll` を省略している（=デフォルト `true`）
   `MultilineText` の呼び出しを全部洗い出し、**幅の狭いコンテナ or `overflow-hidden` の中**にあるものは
   `keepAll={false}` に直す:
   ```
   grep -rn "MultilineText" components app
   ```
   特に確認: `Scenes.tsx` の全4枚、`SeatDetail.tsx`、`SeatsFacts.tsx`、`Interior.tsx`、
   `CourseGrid.tsx`、`IntlReserveMain.tsx`、`app/reserve/intl/page.tsx` の policy リスト。

### 完了条件
- 「海外からのお客様」カードの「世界各国からのお客様にご愛顧いただいています。」が**全文表示される**。
- 5言語 × PC / タブレット / スマホ幅（320 / 375 / 768 / 1280 / 1600px）で
  4枚のカードすべて文字切れなし。
- 他セクションでも同様の見切れがない。

---

## ⑭ 日本語ページ「電話で予約する」→ 注意事項・同意画面を挟む

### 対象ファイル
- `components/ui/ReserveButton.tsx`（全面改修）
- `components/reserve/IntlReserveMain.tsx`（日本語分岐で電話番号を直接表示している箇所）

### 現状（重要：抜け道が2つある）

1. **`components/ui/ReserveButton.tsx`**
   - 日本語（`isJa`）のときだけ `<a href="tel:...">` を描画する。
   - `isDesktopPointer()`（`(hover: hover) and (pointer: fine)`）が **true のときだけ** `preventDefault()` して
     モーダルを開き、電話番号 + 「番号をコピー」+「電話をかける」を表示する。
   - **スマホは即 `tel:` が発火して発信画面に飛ぶ**（注意事項を挟めていない）。
2. **`components/reserve/IntlReserveMain.tsx:27-35`**
   - 日本語ページの `/reserve` で、**モーダルを開く前からページ上に電話番号が生で出ている**
     （`{siteConfig.reservationPhoneDisplay}` = `090-3650-0710`）。ここも塞がないと同意ゲートが意味を失う。

### やること

**1) `ReserveButton.tsx` を「常にモーダル」に変更**

- `isDesktopPointer()` による分岐を撤去。日本語のとき、`<a>` は**常に `preventDefault()` してモーダルを開く**。
  （`<a href="tel:...">` のままにしておけば JS 無効時のフォールバックになるので、要素自体は残してよい）
- モーダルの中身を以下の順に構成する:
  1. 見出し **`ご予約前にご確認ください`** → `t(copy.intlForm.policyHeading)`（⑦で日本語をこの文言に変更済み）
  2. 注意事項リスト → `t(copy.intlForm.policyItems)` を `\n` で split して `<ul><li>`。
     **⑦と同じ内容を再利用する。文言を二重管理しないこと。**
     `※` / `*` 行は⑦と同様に点なしの注記として下に出す。
     → ⑦で切り出した `lib/content/reservationPolicy.ts` の分割ヘルパーをここでも使う。
  3. チェックボックス **`上記内容を確認し、同意しました`** → `t(copy.intlForm.agreePolicy)`（既存キー。JA は既にこの文言）
  4. 電話番号 + 「番号をコピー」+「電話をかける」

**2) 同意ゲートの挙動**

- `const [agreed, setAgreed] = useState(false)` を追加。モーダルを開くたびに `false` にリセットする。
- `agreed === false` のとき:
  - **電話番号を表示しない**（DOM に出さない。`opacity` や `blur` で隠すだけでは
    開発者ツール/読み上げで見えてしまう）。代わりにプレースホルダ（`text-cream/45` で `— — —` など）を出す。
  - 「電話をかける」ボタンを `disabled`（`aria-disabled` + `pointer-events-none opacity-50`）にする。
  - 「番号をコピー」も同様に無効化する。
- `agreed === true` になったら番号を表示し、両ボタンを有効化する。

**3) スマホ挙動**

- 「電話をかける」は `<a href={siteConfig.reservationPhoneHref}>`（= `tel:09036500710`）。
  同意後にタップすると**そのまま端末の発信画面に進む**。
- 無効時は `<a>` を描画せず `<span>` / `<button disabled>` に差し替える
  （`pointer-events-none` だけだと環境によって発火しうる）。
- **PC もスマホも同じ仕様**（PC は「番号をコピー」も併せて使える）。

**4) モーダルのレイアウト**

- 注意事項10行が入るので縦に長くなる。既存の
  `max-h-[90dvh] w-full max-w-md overflow-y-auto`（109行）を活かし、
  `max-w-md` → `max-w-lg` 程度に広げる。
- スマホで**スクロールできること**、チェックボックスとボタンに到達できることを実機幅で確認。
- 既存の a11y / UX は維持: `role="dialog" aria-modal="true" aria-labelledby`、
  Escape で閉じる、背景クリックで閉じる、`document.body.style.overflow = "hidden"`、
  `AnimatePresence` + `modalBackdrop` / `modalPanel` のアニメーション、
  `useReducedMotion()` 対応。
- チェックボックスは `min-h-11` のタップ領域を確保し、`<label>` でテキスト全体をタップ可能にする。

**5) `IntlReserveMain.tsx` の日本語分岐（15〜58行）も塞ぐ**

`t(copy.intlForm.domesticLead)` の下に**生の電話番号が出ている**（27〜35行）。ここを:
- 電話番号の直接表示を**削除**し、`ReserveButton` だけを残す（番号は同意後のモーダル内で見せる）
- 「ご予約電話番号」ラベル（`copy.reserve.phoneLabel`）と受付時間（`copy.reserve.hours`）は
  そのまま残してよいが、**番号そのもの（`siteConfig.reservationPhoneDisplay`）は消す**。

**6) 対象外（変更しない）**

- `components/sections/Access.tsx` の店舗情報表にある電話番号（`storeInfoRows` の `電話番号` 行）は
  **店舗情報としての掲載**なので、同意ゲートの対象外とする。
  → **この判断はオーナー確認事項。** 「予約ボタン経由は必ず注意事項を通す」という要件は満たすが、
  アクセス表からは番号が見える状態が残る。ゲートしたい場合は別途指示を仰ぐこと。
- 英語 / 廣東話 / 繁體中文 / 한국어 は従来どおり `/reserve/intl` のフォームへ遷移（`isJa` 以外の分岐は不変）。

### 完了条件
- **PC**: 「電話で予約する」クリック → 注意事項 + チェックボックスのモーダル。
  未チェックでは番号が見えず、「電話をかける」「番号をコピー」が押せない。
  チェック後に番号が表示され、両ボタンが有効になる。
- **スマホ**: 「電話で予約する」タップ → 同じモーダル（即発信しない）。
  チェック後に「電話をかける」で端末の発信画面へ遷移する。
- `/reserve`（日本語）ページ上に、同意前の生の電話番号が表示されていない。
- 注意事項の文言が⑦と**同一のソース**（`copy.intlForm.policyItems`）から来ている。
- Escape / 背景クリックで閉じ、再度開くとチェックが外れている。
- `prefers-reduced-motion: reduce` でも操作できる。

---

## 15. 全体の完了チェック

```bash
node scripts/build-locale-files.mjs   # translations.json を編集した場合に実行
npm run lint                          # エラー 0
npm run build                         # 型エラー・ビルドエラー 0
```

### 手動確認マトリクス

| 確認項目 | ja | en | yue | zhTw | ko |
|---|---|---|---|---|---|
| `/` トップ（①家紋 / ⑪金文字 / ⑫定休日 / ⑬シーン） | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/course`（⑥サービス料 / ⑪） | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/reserve`（⑫ / ⑭同意ゲート / ⑪） | ✓ | – | – | – | – |
| `/reserve/intl`（②③④⑤⑦⑩⑪⑫） | ✓ | ✓ | ✓ | ✓ | ✓ |
| `/seats`（⑪⑬） | ✓ | ✓ | ✓ | ✓ | ✓ |

### ビューポート
320 / 375 / 414 / 768 / 1024 / 1280 / 1600px。**横スクロールが出ないこと。**
（`overflow-x-clip` が随所にあるため、はみ出しは横スクロールではなく「文字切れ」として現れる。
⑬と同種のバグを新規に作り込まないよう注意）

### メール送信の確認（Resend 設定後）
- 海外フォーム送信 → お客様に**英語の自動返信**（⑧の件名・本文と完全一致）
- 同時に `RESEND_OWNER_TO` へオーナー通知（②電話番号 / ③4区分 + 0〜5歳警告 / ④きっかけ が載る / ⑤備考なし）
- 自動返信の Reply-To が Gmail になっている
- Resend 未設定でも予約リクエスト自体は成功し、Supabase に保存される

### 変更しないもの（念押し）
- `copy.form.*` と `components/reserve/ReservationForm.tsx`（日本語向けオンラインフォーム）は
  ⑫の定休日表記以外は触らない。
- `--color-gold` の値そのもの（⑪はトークン追加で対応）。
- 斜めワイプ定数 `CLIP_*` / `WIPE_DURATION` / `WIPE_EASE`（ヒーロースライドショーで使用中）。
- `reservation_requests` の既存カラム（`children` / `notes` を含め DROP 禁止）。

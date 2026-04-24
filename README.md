# designwork コードレビュー

> **レビュー対象:** HTML / CSS / JavaScript（バニラ）  
> **レビュー観点:** 初心者向け — バグ・構造・命名・アクセシビリティ・保守性

---

## 総合評価

**よく書けている点が多く、完成度は高いです。**  
CSS カスタムプロパティの活用、`'use strict'` の使用、レスポンシブ対応、動画フォールバックなど、初心者が見落としがちな部分もしっかり対応されています。  
一方でいくつか **バグ・タイポ・HTML 仕様違反** があり、ブラウザによっては意図しない表示になる可能性があります。

---

## 🔴 バグ・仕様違反（優先度：高）

### 1. `<viewport>` メタタグが2つある（index.html・works.html）

```html
<!-- 5行目 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 9行目（こちらが実際に効く） -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no">
```

**問題:** 同じ `name="viewport"` が2つあると後者が優先されます。最初の1行は無意味です。  
**修正:** どちらか1つに統一してください。

また `user-scalable=no` はアクセシビリティ上の問題があります（視覚に障害のある方がピンチズームできなくなる）。  
**W3C では `user-scalable=no` の使用を推奨していません。**

---

### 2. `<li>` が `<ul>` の外に書かれている（index.html・works.html）

```html
<!-- NG: <a> が <li> を包んでいる -->
<nav class="nav_menu">
  <a href="services.html"><li>SERVICES</li></a>
  <a href="works.html"><li>WORKS</li></a>
</nav>
```

**問題:** `<li>` は `<ul>` または `<ol>` の直接の子要素でなければなりません。これは HTML 仕様違反で、ブラウザによって表示が崩れる原因になります。  
**修正:**

```html
<nav class="nav_menu">
  <ul>
    <li><a href="services.html">SERVICES</a></li>
    <li><a href="works.html">WORKS</a></li>
    <li><a href="mailto:...">CONTACT</a></li>
  </ul>
</nav>
```

---

### 3. `<button>` の中に `<a>` が入っている（index.html）

```html
<button class="content_btn_box">
  <a class="content_btn" href="services.html">制作サービス一覧</a>
</button>
```

**問題:** `<button>` の中にインタラクティブ要素（`<a>` など）を入れることは HTML 仕様違反です。  
**修正:** どちらか一方を使ってください。リンクなら `<a>` のみで十分です。

```html
<!-- シンプルに <a> だけでOK -->
<div class="content_btn_box">
  <a class="content_btn" href="services.html">制作サービス一覧</a>
</div>
```

---

### 4. CSS で `header` の `width` に `vh` を使っている（common.css 27行目）

```css
header {
  height: 100px;
  width: 100vh; /* ← バグ！ */
}
```

**問題:** `vh`（viewport height の単位）が `vw`（viewport width）の場所に使われています。縦長画面では幅が足りなくなります。  
**修正:** `width: 100vw;`

---

### 5. `#video` CSS ルールが2回定義されている（common.css 10行目・104行目）

```css
/* 10行目 */
#video {
  z-index: -1;
  opacity: 0.5;      /* ← こちらが上書きされる */
  ...
}

/* 104行目 */
#video {
  z-index: -1;
  opacity: 1;        /* ← こちらが実際に適用される */
  ...
}
```

**問題:** 同じセレクタが2か所にあり、後者が常に上書きします。上の定義は無意味になっています。  
**修正:** 1か所にまとめてください。

---

### 6. XML 宣言が HTML の途中に書かれている（works.html 86行目）

```html
<?xml version="1.0" encoding="UTF-8"?>
<svg ...>
```

**問題:** `<?xml ...?>` は XML 文書の宣言で、HTML ファイルの中に書くものではありません。ブラウザによってはエラーとして扱われます。  
**修正:** この行を削除してください。SVG タグだけで問題ありません。

---

## 🟡 本番環境に残っている開発用コード（優先度：中）

### 7. `console.log` が複数残っている

```js
// main.js 10行目
console.log(nav_btn);

// works.js 38行目
console.log(kindsObject[key]);

// works.js 99行目
console.log(JSON.stringify(works_list_json));
```

**問題:** 開発中のデバッグコードがそのまま残っています。公開サイトでブラウザの開発者ツールを開いたときに表示されてしまいます。  
**修正:** 本番公開前にすべての `console.log` を削除してください。

---

### 8. 開発用コードが本番に含まれている（works.js 79〜104行目）

```js
(async () => {
  // ファイルのjpgからjsonデータへ変換
  let works_list_json = await fetchText('assets/works');
  // ...
  console.log(JSON.stringify(works_list_json)); // ← JSON生成ツール
})();
```

**問題:** このコードはディレクトリ一覧から JSON を生成するためのローカル開発ツールです。本番では不要な処理が毎回実行されています。  
**修正:** このブロック全体を削除してください。

---

## 🟡 タイポ（スペルミス）

### 9. ファイル名・クラス名のスペルミス

| 場所 | 誤り | 正しくは |
|------|------|----------|
| `assets/css/animetion.css` | `animetion` | `animation` |
| HTML・CSS 全般 `.content_sabtitle` | `sabtitle` | `subtitle` |
| `animation.js` 50行目 `.farstText` | `farstText` | `firstText` |
| `assets/img/icon_content_sarvices.svg` | `sarvices` | `services` |

スペルミスはファイル名の変更や全体への影響が出るため、まとめて修正することをおすすめします。

---

## 🟡 SEO・アクセシビリティ（優先度：中）

### 10. meta description と OGP タグがコメントアウトされている

```html
<!-- SEO対策ディスクリプション -->
<!-- <meta name="description" content="..."> -->
```

**問題:** Google 検索の結果に説明文が表示されなくなります。  
**修正:** このサイト専用の説明文を書いて有効化してください。

---

### 11. `<img>` の alt 属性が空になっている（ロゴ・ハンバーガーアイコン）

```html
<img src="assets/img/designwork.svg" alt="">    <!-- ロゴなのに空 -->
<img class="nav_btn" src="assets/img/icon_menu_hamburger.svg" alt="">  <!-- ボタンなのに空 -->
```

**問題:** スクリーンリーダーを使うユーザーに情報が伝わりません。  
**修正:**

```html
<img src="assets/img/designwork.svg" alt="Design Work ロゴ">
<img class="nav_btn" src="assets/img/icon_menu_hamburger.svg" alt="メニューを開く">
```

---

### 12. メールアドレスが HTML に直書きされている

```html
<a href="mailto:designwork.free@gmail.com">
```

**問題:** スパムボットにメールアドレスが収集されやすくなります。  
**修正案:** お問い合わせフォームを設置するか、JavaScript で動的に組み立てる方法があります。

---

## 🟢 改善提案（優先度：低）

### 13. DOM 取得を繰り返している（works.js 114〜136行目）

```js
function createImgWorks(worksArr){
  document.querySelector('#works_list_box').innerHTML = ''; // ← 毎回取得
  worksArr.forEach(work => {
    // ...
    document.querySelector('#works_list_box').appendChild(li); // ← ループ内でも毎回取得
  });
}
```

**改善案:** 関数の先頭で1回だけ取得し変数に保存すると、パフォーマンスが向上します。

```js
function createImgWorks(worksArr){
  const listBox = document.querySelector('#works_list_box');
  listBox.innerHTML = '';
  worksArr.forEach(work => {
    // ...
    listBox.appendChild(li);
  });
}
```

---

### 14. `inset: 0 0 0 0` は `inset: 0` と書ける（CSS 全般）

```css
/* 冗長 */
inset: 0 0 0 0;

/* シンプル */
inset: 0;
```

---

### 15. `test.html` と `__test.css` が残っている

本番サイトには不要なファイルです。公開時は削除またはアクセス制限を設けることをおすすめします。

---

### 16. `assets/fonts/×/` フォルダ名が特殊文字

フォルダ名に `×`（かける記号）が使われています。OS やサーバーによってはパスの解釈が異なる場合があります。  
`_unused` や `_backup` などの英数字フォルダ名を推奨します。

---

## まとめ

| カテゴリ | 件数 |
|----------|------|
| 🔴 バグ・仕様違反（要修正） | 6件 |
| 🟡 本番残り開発コード | 2件 |
| 🟡 タイポ | 4件 |
| 🟡 SEO・アクセシビリティ | 3件 |
| 🟢 改善提案 | 4件 |

---

## 良かった点

- CSS カスタムプロパティ（`--color-*`, `--font-size-*`）をしっかり活用できている
- `reset.css` でブラウザ差異をリセットしている
- JavaScript に `'use strict'` を宣言している
- `font-display: swap` でフォント読み込み時のちらつきを考慮している
- スマートフォン対応のレスポンシブデザインが実装されている
- 動画が使えない環境向けにフォールバック（`<p>動画を再生できる環境ではありません。</p>`）を用意している
- CSS バージョニング（`?v=8`）でキャッシュ問題を回避する工夫をしている
- スクロールアニメーションを IntersectionObserver でなく `getBoundingClientRect` で実装している（動作はする）

全体的に**デザインへの意識が高く、視覚的な完成度は非常に高い**です。上記の修正を加えることでさらに品質の高いサイトになります！




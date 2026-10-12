# redocly-plugin-inline-examples

OpenAPI の `examples` 配下にある `$ref: *.yaml` を、bundle 時にインライン展開する
Redocly (`@redocly/openapi-core`) の oas3 preprocessor プラグイン。

npm には publish せず、GitHub のタグを git 依存で参照する。

## 仕組み

oas3 の `Operation` の `requestBody` / `responses` を走査し、`examples` の値に含まれる
`$ref: *.yaml` を再帰的に解決して内容をインライン展開する。`$ref` 先の YAML は
`node:fs` で読み込む。

プラグイン id は `ansanloms`、preprocessor 名は `inline-examples`
(redocly.yaml では `ansanloms/inline-examples` で参照する)。

## 利用

インストール:

```sh
npm install -D github:ansanloms/redocly-plugin-inline-examples#0.1.0
```

`redocly.yaml` からはローカルのラッパーを置いて参照する。

ラッパー (例 `redocly/plugins/inline-examples.mjs`):

```js
export { default } from "@ansanloms/redocly-plugin-inline-examples";
```

TypeScript でラッパーを書く場合は、型の解決に `@redocly/openapi-core` が必要なため devDependencies に入れる。本パッケージは `@redocly/openapi-core` を optional な peerDependency として宣言している。

`redocly.yaml`:

```yaml
plugins:
  - "./redocly/plugins/inline-examples.mjs"
preprocessors:
  ansanloms/inline-examples: on
```

> [!NOTE]
> Redocly CLI 2.x の plugin ローダは ESM の動的 import で読み込むため、ラッパーは
> ESM (`.mjs`、または `"type": "module"` 配下の `.js`) にする。
> Redocly CLI 2.x は Node 20.19 以上または 22.12 以上が必要。

## 開発

```sh
npm ci
npm test            # テスト
npm run check       # 型チェック
npm run lint        # oxlint && oxfmt --check
npm run fix         # oxlint --fix && oxfmt
npm run compile     # dist/ を消してから生成
```

`dist/` は tsc の出力でコミットする。CI が鮮度を検査する。git 依存はインストール時に
`build` / `prepare` 等のスクリプトが走るため、それらは置かず、コミット済みの `dist/` を配布する。
Node 24 は開発環境の要件で、配布物は素の ESM。`typescript` の更新で `dist/` が変わった場合は、
PR ブランチで `npm run compile` してコミットする。
依存は正確な版で固定し (`.npmrc` の `save-exact`)、更新は Dependabot の PR で取り込む。
`ignore-scripts` で install 時に依存の lifecycle script を実行しない (`npm run` の本体 script には影響しない)。`min-release-age` で公開から 7 日未満の版を新規に解決しない (lockfile に固定済みの版には効かない)。

### リリース手順

1. `npm version <version> --no-git-tag-version` → `npm run compile` → コミット。
2. 同じ値でタグを打って push。GitHub Release は作らない。

## ライセンス

MIT

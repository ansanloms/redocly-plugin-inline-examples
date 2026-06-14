# redocly-plugin-inline-examples

OpenAPI の `examples` 配下にある `$ref: *.yaml` を、bundle 時にインライン展開する
Redocly (`@redocly/openapi-core`) の oas3 preprocessor プラグイン。

deno で開発し、npm / JSR には publish せず
[jsDelivr](https://www.jsdelivr.com/) の gh エンドポイント経由で配信する。

## 仕組み

oas3 の `Operation` の `requestBody` / `responses` を走査し、`examples` の値に含まれる
`$ref: *.yaml` を再帰的に解決して内容をインライン展開する。`$ref` 先の YAML は
`Deno.readTextFileSync` で読み込む (Deno 専用)。

プラグイン id は `ansanloms`、preprocessor 名は `inline-examples`
(redocly.yaml では `ansanloms/inline-examples` で参照する)。

## 利用

Redocly は Deno 上で動かす前提。Redocly の `plugins:` は URL / import map specifier を
直接解決できずローカルファイルパスのみを受け付けるため、ソースの `index.ts` を
import map 経由で読み込む薄いローカルラッパーを置き、それを `redocly.yaml` から参照する。

bundle 済み成果物は配信しない (Deno 専用の為そのままソース `.ts` を配信する)。
依存は consumer の import map では解決できないため、`deps/` に `npm:` / `jsr:` 完全修飾で
集約し、本体コードは相対 import で参照する。

`deno.json` の import map:

```json
{
  "imports": {
    "@ansanloms/redocly-plugin-inline-examples/": "https://cdn.jsdelivr.net/gh/ansanloms/redocly-plugin-inline-examples@0.0.1/"
  }
}
```

ローカルラッパー (例 `redocly/plugins/index.ts`):

```ts
export { default } from "@ansanloms/redocly-plugin-inline-examples/index.ts";
```

`redocly.yaml`:

```yaml
plugins:
  - "./redocly/plugins/index.ts"
preprocessors:
  ansanloms/inline-examples: on
```

> [!NOTE]
> jsDelivr の gh エンドポイントはタグ固定 (`@0.0.1` など) を推奨する。
> `@main` などのブランチ参照は最大 12 時間 CDN にキャッシュされる。

## 開発

```sh
deno task test    # テスト (coverage 付き)
deno task check   # 型チェック
deno task lint    # deno lint && deno fmt --check
deno task fix     # deno lint --fix && deno fmt
```

`npm:` / `jsr:` への依存は `deps/` に集約している
(jsDelivr 単体配信のため完全修飾で抱える)。本体コードは相対 import で参照する。

## ライセンス

MIT

// deno-lint-ignore-file no-import-prefix -- jsDelivr 単体配信では利用者側の import map を読めないため npm: 完全修飾で抱える。

// yaml (npm) への依存をこのファイルに集約する。
export { parse } from "npm:yaml@2.9.0";

// deno-lint-ignore-file no-import-prefix -- jsDelivr 単体配信では利用者側の import map を読めないため jsr: 完全修飾で抱える。

// @std/path (jsr) への依存をこのファイルに集約する。
export { dirname, extname, join } from "jsr:@std/path@1.1.5";

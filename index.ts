import type { Oas3Preprocessor } from "@redocly/openapi-core";

import { InlineExamples } from "./preprocessors/inline-examples.ts";

export const preprocessors: Record<string, Oas3Preprocessor> = {
  "inline-examples": InlineExamples,
};

const plugin = () => ({
  id: "ansanloms",
  preprocessors: {
    oas3: preprocessors,
  },
});

export default plugin;

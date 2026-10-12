import type { Oas3Preprocessor } from "@redocly/openapi-core";
export declare const preprocessors: Record<string, Oas3Preprocessor>;
declare const plugin: () => {
    id: string;
    preprocessors: {
        oas3: Record<string, Oas3Preprocessor>;
    };
};
export default plugin;

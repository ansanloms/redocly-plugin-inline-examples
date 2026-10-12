import { InlineExamples } from "./preprocessors/inline-examples.js";
export const preprocessors = {
    "inline-examples": InlineExamples,
};
const plugin = () => ({
    id: "ansanloms",
    preprocessors: {
        oas3: preprocessors,
    },
});
export default plugin;

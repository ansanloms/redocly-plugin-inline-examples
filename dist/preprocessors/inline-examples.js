import { dirname, extname, join } from "node:path";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
const isContainer = (value) => typeof value === "object" && value !== null;
const getYaml = (p) => {
    const result = parse(readFileSync(p, "utf8"));
    return typeof result === "object" && result !== null && !Array.isArray(result)
        ? result
        : {};
};
const bundle = (target, baseDir) => {
    if (Array.isArray(target)) {
        return target.map((value) => (isContainer(value) ? bundle(value, baseDir) : value));
    }
    const result = {};
    for (const [key, value] of Object.entries(target)) {
        if (key === "$ref" && typeof value === "string" && extname(value) === ".yaml") {
            const targetPath = join(baseDir, value);
            Object.assign(result, bundle(getYaml(targetPath), dirname(targetPath)));
        }
        else {
            result[key] = isContainer(value) ? bundle(value, baseDir) : value;
        }
    }
    return result;
};
const bundleEntry = (target, baseDir) => {
    if (Array.isArray(target)) {
        return target.map((value) => (isContainer(value) ? bundleEntry(value, baseDir) : value));
    }
    return Object.fromEntries(Object.entries(target).map(([key, value]) => {
        if (isContainer(value)) {
            return [key, key === "examples" ? bundle(value, baseDir) : bundleEntry(value, baseDir)];
        }
        return [key, value];
    }));
};
export const InlineExamples = () => ({
    Operation: {
        leave(target, ctx) {
            const basedir = dirname(ctx.location.source.absoluteRef);
            if (target.requestBody && isContainer(target.requestBody)) {
                target.requestBody = bundleEntry(target.requestBody, basedir);
            }
            if (target.responses && isContainer(target.responses)) {
                target.responses = bundleEntry(target.responses, basedir);
            }
        },
    },
});

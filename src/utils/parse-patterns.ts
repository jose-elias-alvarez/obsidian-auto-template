type PatternMatcher = (path: string) => string | undefined;

export default (patterns: string) => {
    if (!patterns) return [];

    const matchers: PatternMatcher[] = [];
    for (const element of patterns.split("\n").map((line) => line.split(":"))) {
        if (element.length !== 2) {
            throw new Error(
                `Invalid format: "${element.join(
                    ":"
                )}". Use "Folder:Template" format.`
            );
        }

        const [pattern, template] = element;
        matchers.push((path) => {
            if (pattern.startsWith("/") && pattern.endsWith("/")) {
                const regex = new RegExp(pattern.slice(1, -1));
                if (regex.test(path)) {
                    return template;
                }
            } else if (path.startsWith(pattern) || pattern === "*") {
                return template;
            }
        });
    }
    return matchers;
};

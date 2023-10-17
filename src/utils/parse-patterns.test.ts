import parsePatterns from "./parse-patterns";

describe("parsePatterns", () => {
	it("returns an empty array when given an empty string", () => {
		const patterns = "";
		const result = parsePatterns(patterns);
		expect(result).toEqual([]);
	});

	it("throws an error when given an invalid pattern", () => {
		const patterns = "Folder";
		expect(() => parsePatterns(patterns)).toThrow(
			'Invalid format: "Folder". Use "Folder:Template" format.'
		);
	});

	it("returns a matcher for a simple text pattern", () => {
		const patterns = "Folder:Template";
		const matchers = parsePatterns(patterns);
		expect(matchers).toHaveLength(1);
		expect(matchers[0]("Folder")).toEqual("Template");
	});

	it("returns matchers for multiple simple text patterns", () => {
		const patterns = "Folder:Template\nFolder2:Template2";
		const matchers = parsePatterns(patterns);
		expect(matchers).toHaveLength(2);
		expect(matchers[0]("Folder")).toEqual("Template");
		expect(matchers[1]("Folder2")).toEqual("Template2");
	});

	it("returns a matcher for a regex pattern", () => {
		const patterns = "/Fo.*/:Template";
		const matchers = parsePatterns(patterns);
		expect(matchers).toHaveLength(1);
		expect(matchers[0]("Folder")).toEqual("Template");
	});

	it("returns a matcher for a wildcard pattern", () => {
		const patterns = "*:Template";
		const matchers = parsePatterns(patterns);
		expect(matchers).toHaveLength(1);
		expect(matchers[0]("Folder")).toEqual("Template");
	});
});

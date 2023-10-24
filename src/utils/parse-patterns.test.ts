import parsePatterns from "./parse-patterns";

describe("parsePatterns", () => {
    it("returns an empty array when given an empty pattern", () => {
        const patterns = "";
        const result = parsePatterns(patterns);
        expect(result).toEqual([]);
    });

    it("throws an error when given a pattern without a template", () => {
        const patterns = "Folder";
        expect(() => parsePatterns(patterns)).toThrow(
            'Invalid format: "Folder". Use "Folder:Template" format.',
        );
    });

    it("throws an error when given a pattern with too many elements", () => {
        const patterns = "Folder:Template:Extra";
        expect(() => parsePatterns(patterns)).toThrow(
            'Invalid format: "Folder:Template:Extra". Use "Folder:Template" format.',
        );
    });

    it("parses a simple text pattern", () => {
        const patterns = "Folder:Template";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(1);
        expect(matchers[0]("Folder")).toEqual("Template");
        expect(matchers[0]("OtherFolder")).toBeUndefined();
    });

    it("parses a simple text pattern w/ spaces", () => {
        const patterns = "My Folder:My Template";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(1);
        expect(matchers[0]("My Folder")).toEqual("My Template");
    });

    it("parses multiple simple text patterns", () => {
        const patterns = "Folder:Template\nFolder2:Template2";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(2);
        expect(matchers[0]("Folder")).toEqual("Template");
        expect(matchers[1]("Folder2")).toEqual("Template2");
    });

    it("parses a regex pattern", () => {
        const patterns = "/Folder\\d/:Template";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(1);
        expect(matchers[0]("Folder1")).toEqual("Template");
        expect(matchers[0]("Folder2")).toEqual("Template");
        expect(matchers[0]("Folder3")).toEqual("Template");
        expect(matchers[0]("Folder/Subfolder")).toBeUndefined();
    });

    it("parses a wildcard pattern", () => {
        const patterns = "*:Template";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(1);
        expect(matchers[0]("Folder")).toEqual("Template");
        expect(matchers[0]("adjfgjsdfjsj")).toEqual("Template");
        expect(matchers[0]("Deeply/Nested/Folder")).toEqual("Template");
    });

    it("parses a longer regex pattern", () => {
        const patterns = "/^Dates\\/\\d{4}-\\d{2}-\\d{2}$/:Daily";
        const matchers = parsePatterns(patterns);
        expect(matchers).toHaveLength(1);
        expect(matchers[0]("Dates/2023-01-01")).toEqual("Daily");
        expect(matchers[0]("Dates/1990-12-31")).toEqual("Daily");
        expect(matchers[0]("Dates/Overview")).toBeUndefined();
        expect(matchers[0]("Nested/Dates/1990-12-31")).toBeUndefined();
        expect(matchers[0]("Dates/1990-12-31/Nested")).toBeUndefined();
    });
});

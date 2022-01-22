import { parseService } from "../parse-service";
import { stringExtensions } from "../../utils/string-extensions";

it("parseString method returns an empty array when input is empty", () => {
    const result = parseService.parseString("");
    expect(result).toEqual([]);
    expect(result.length).toEqual(0);
});

it("parseString method returns an array when input is valid", () => {
    const result = parseService.parseString(stringExtensions.unicodeTob64("2 +4/3-(2+-5)*.5++1"));
    expect(result.length).toEqual(19);
});

it("parseString method throws exception if input has invalid characters", () => {
    try {
        parseService.parseString(stringExtensions.unicodeTob64("2+%4=2"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains unmatching parenthesis", () => {
    try {
        parseService.parseString(stringExtensions.unicodeTob64("(2+2))"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains invalid operator sequence", () => {
    try {
        parseService.parseString(stringExtensions.unicodeTob64("2+89*-76/24+(88/2+--34)"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains invalid float", () => {
    try {
        parseService.parseString(stringExtensions.unicodeTob64("2+2.5.55"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});
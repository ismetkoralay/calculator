import { calculusService } from "../calculus-service";
import { stringExtensions } from "../../utils/string-extensions";

it("parseString method returns an empty array when input is empty", () => {
    const result = calculusService.parseString("");
    expect(result).toEqual([]);
    expect(result.length).toEqual(0);
});

it("parseString method throws exception if input has invalid characters", () => {
    try {
        const result = calculusService.parseString(stringExtensions.unicodeTob64("2+%4=2"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains unmatching parenthesis", () => {
    try {
        const result = calculusService.parseString(stringExtensions.unicodeTob64("(2+2))"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains invalid operator sequence", () => {
    try {
        const result = calculusService.parseString(stringExtensions.unicodeTob64("2+89*-76/24+(88/2+--34)"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("parseString method throws exception if input contains invalid float", () => {
    try {
        const result = calculusService.parseString(stringExtensions.unicodeTob64("2+2.5.55"));
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});
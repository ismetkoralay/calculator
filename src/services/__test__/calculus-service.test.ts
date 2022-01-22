import { TokenModel } from "../../models/token-model";
import { calculusService } from "../calculus-service";

const validTokenModelArray: TokenModel[] = [{
    type: "number",
    value: 3
}, {
    type: "operator",
    value: "+"
}, {
    type: "operator",
    value: "("
}, {
    type: "number",
    value: 2
}, {
    type: "operator",
    value: "*"
}, {
    type: "number",
    value: 25
}, {
    type: "operator",
    value: "+"
}, {
    type: "number",
    value: 14
}, {
    type: "operator",
    value: ")"
}, {
    type: "operator",
    value: "/"
}, {
    type: "number",
    value: 2
}];

const invalidTokenModelArray: TokenModel[] = [{
    type: "number",
    value: 3
}, {
    type: "operator",
    value: "+"
}, {
    type: "operator",
    value: "("
}, {
    type: "number",
    value: "2"
}, {
    type: "operator",
    value: "*"
}, {
    type: "number",
    value: 25
}];

it("createPostfixArray method returns an empty array when input is empty", () => {
    const result = calculusService.createPostfixArray([]);
    expect(result).toEqual([]);
    expect(result.length).toEqual(0);
});

it("createPostfixArray method returns a nonempty array when input is valid token model", () => {
    const result = calculusService.createPostfixArray(validTokenModelArray);
    expect(result).not.toBe(null);
    expect(result).not.toBe(undefined);
    expect(result.length).not.toEqual(0);
    expect(result.length).toEqual(9);
});

it("createPostfixArray method throws exception when input is invalid token model", () => {
    try {
        calculusService.createPostfixArray(invalidTokenModelArray);   
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

const validPostfixArray: (string | number)[] = [4, 2, "/", 3, "+", 6, 7, 25, "-", "+", "*"];
const invalidPostfixAraay: (string | number)[] = [1, "*", 2, 3, "+", "+"];

it("evaluatePostfix method returns result when input is valid postfix array", () => {
    const result = calculusService.evaluatePostfix(validPostfixArray);
    expect(result).toEqual(-60);
});

it("evaluatePostfix method throws exception when input is empty array", () => {
    try {
        calculusService.evaluatePostfix([]);
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});

it("evaluatePostfix method throws exception when input is invalid", () => {
    try {
        calculusService.evaluatePostfix(invalidPostfixAraay);
    } catch (error) {
        return;
    }

    throw new Error("It should throw error and shouldn't reach up here.");
});
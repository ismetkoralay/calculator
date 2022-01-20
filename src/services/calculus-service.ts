import { stringExtensions } from "../utils/string-extensions";
import { TokenModel } from "../models/token-model";
import { CustomError } from "../error/custom-error";

class CalculusService {

    private operatorMap = new Map<string, number>([
        ["+", 1],
        ["-", 1],
        ["(", 0],
        [")", 0],
        ["*", 2],
        ["/", 2]
    ]);

    private digits = new Set<string>(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]);
    private operators = new Set<string>(["+", "-", "*", "/", "(", ")"]);

    parseString(input: string): TokenModel[] {
        
        const decoded = stringExtensions.b64DecodeUnicode(input);
        const expression = decoded.trim();
        const tokensArray: TokenModel[] = [];
        let openParenthesisCount = { value: 0};
        let closedParenthesisCount = { value: 0};

        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if (this.operators.has(char)) {
                this.handleOperator(char, tokensArray, openParenthesisCount, closedParenthesisCount);
            } else if (this.digits.has(char)) {
                i = this.handleDigit(char, expression, i, tokensArray);
            } else if (char === " ") {
                continue;
            } else {
                throw new CustomError(400, "Invalid characters in query!!");
            }
        }

        if (openParenthesisCount.value !== closedParenthesisCount.value) {
            throw new CustomError(400, "Invalid query!!");
        }

        return tokensArray;
    }

    createPostfixArray(tokensArray: TokenModel[]): (string | number)[] {

        const postFixArray: (string | number)[] = [];
        const opStack: string[] = [];

        for (let elem of tokensArray) {
            if (elem.type === "number") {
                postFixArray.push(elem.value);
            } else {
                var op = elem.value as string;
                if (op === "(") {
                    opStack.push(op);
                } else if (op === ")") {
                    while (opStack.length) {
                        const elem = opStack.pop();
                        if (elem === "(") {
                            break;
                        }
                        postFixArray.push(elem as string);
                    }
                } else {
                    while (opStack.length && this.operatorMap.has(opStack[opStack.length - 1]) && this.operatorMap.get(opStack[opStack.length - 1])! >= this.operatorMap.get(op)!) {
                        postFixArray.push(opStack.pop() as string);
                    }
                    opStack.push(op);
                }
            }
        }

        while (opStack.length) {
            const elem = opStack.pop();
            if (elem === "(") {
                throw new CustomError(400, "Query has mismatched parenthesis.");
            }

            postFixArray.push(elem as string);
        }

        return postFixArray;
    }

    evaluatePostfix(postfixArray: (string | number)[]): number {
        const callStack: number[] = [];

        for (let elem of postfixArray) {
            if (this.operators.has(elem as string)) {
                const second = callStack.pop();
                const first = callStack.pop();
                if (!second || !first) {
                    throw new CustomError(400, "Invalid query.");
                }
                switch (elem) {
                    case "*":
                        callStack.push(first * second);
                        break;
                    case "/":
                        callStack.push(first / second);
                        break;
                    case "+":
                        callStack.push(first + second);
                        break;
                    case "-":
                        callStack.push(first - second);
                        break;
                    default:
                        break;
                }
            } else {
                callStack.push(elem as number);
            }
        }

        if(!callStack.length){
            throw new CustomError(400, "Invalid query.");
        }

        return callStack.pop()!;
    }

    private handleOperator(char: string, tokensArray: TokenModel[], openParenthesisCount: {value: number}, closedParenthesisCount: { value: number}) {
        if (char === "+" || char === "-") {
            if (tokensArray.length === 0 || (tokensArray[tokensArray.length - 1].type === "operator" && tokensArray[tokensArray.length - 1].value !== ")")) {
                if (tokensArray[tokensArray.length - 1]?.isSign) {
                    throw new CustomError(400, "Invalid query!!");
                }
                tokensArray.push({
                    type: "number",
                    value: char === "-" ? -1 : + 1,
                    isSign: true
                }, {
                    type: "operator",
                    value: "*",
                    isSign: true
                });
            } else {
                tokensArray.push({
                    type: "operator",
                    value: char
                });
            }
        } else {
            tokensArray.push({
                type: "operator",
                value: char
            });
            if (char === "(") {
                openParenthesisCount.value++;
            }
            if (char === ")") {
                closedParenthesisCount.value++;
            }
        }
    }

    private handleDigit(char: string, expression: string, i: number, tokensArray: TokenModel[]): number {
        let num = char;

        while (this.digits.has(expression[i + 1])) {
            const next = expression[i + 1];
            num += next;
            i++;
        }

        var count = (num.match(/\./g) || []).length;
        if (count > 1) {
            throw new CustomError(400, "Invalid query!!");
        }

        if (num.startsWith(".")) {
            num = "0" + num;
        }

        const current: TokenModel = {
            type: "number",
            value: parseFloat(num)
        };
        tokensArray.push(current);

        return i;
    }
}

const calculusService = new CalculusService();
export { calculusService };
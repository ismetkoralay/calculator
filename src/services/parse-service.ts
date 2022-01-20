import { CustomError } from "../error/custom-error";
import { TokenModel } from "../models/token-model";
import { digits, operators } from "../utils/object-maps";
import { stringExtensions } from "../utils/string-extensions";

class ParseService {
    
    parseString(input: string): TokenModel[] {
        
        if(input === null || input === undefined || input.length === 0){
            return [];
        }
        
        const decoded = stringExtensions.b64DecodeUnicode(input);
        const expression = decoded.trim();
        const tokensArray: TokenModel[] = [];
        let openParenthesisCount = { value: 0};
        let closedParenthesisCount = { value: 0};

        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            if (operators.has(char)) {
                this.handleOperator(char, tokensArray, openParenthesisCount, closedParenthesisCount);
            } else if (digits.has(char)) {
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

        while (digits.has(expression[i + 1])) {
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

const parseService = new ParseService();
export { parseService };
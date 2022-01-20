import { TokenModel } from "../models/token-model";
import { CustomError } from "../error/custom-error";
import { operators, operatorMap } from "../utils/object-maps";

class CalculusService {

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
                    while (opStack.length && operatorMap.has(opStack[opStack.length - 1]) && operatorMap.get(opStack[opStack.length - 1])! >= operatorMap.get(op)!) {
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
            if (operators.has(elem as string)) {
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
}

const calculusService = new CalculusService();
export { calculusService };
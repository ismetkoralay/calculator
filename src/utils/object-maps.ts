// Keeps operators' priorities
const operatorMap = new Map<string, number>([
    ["+", 1],
    ["-", 1],
    ["(", 0],
    [")", 0],
    ["*", 2],
    ["/", 2]
]);

const digits = new Set<string>(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."]);
const operators = new Set<string>(["+", "-", "*", "/", "(", ")"]);

export { operatorMap, operators, digits };
interface TokenModel {
    type: "number" | "operator";
    value: number | string;
    isSign?: boolean
}

export { TokenModel };
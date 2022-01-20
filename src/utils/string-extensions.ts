class StringExtensions {

    b64DecodeUnicode(input: string): string {
        return Buffer.from(input, "base64").toString("utf-8");
    }
    
}

const stringExtensions = new StringExtensions();
export { stringExtensions };
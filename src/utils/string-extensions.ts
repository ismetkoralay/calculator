class StringExtensions {

    b64DecodeUnicode(input: string): string {
        return Buffer.from(input, "base64").toString("utf-8");
    }

    unicodeTob64(input: string) {
        return Buffer.from(input).toString("base64");
    }

}

const stringExtensions = new StringExtensions();
export { stringExtensions };
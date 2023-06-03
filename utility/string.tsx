

export const stripNonDigits = (str: string, allowDecimal = false): string => {
    const allowed = new Set(allowDecimal ? "0123456789." : "0123456789");
    let result = "";
    let decimal = false;
    for (const char of str) {
        if (!allowed.has(char)) { continue; }
        if (char === ".") {
            if (decimal) { continue; }
            decimal = true;
        }
        result = `${result}${char}`;
    }
    return result;
};

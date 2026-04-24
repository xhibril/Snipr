export function ValidatePassword(password) {

    if (!password) {
        return "Input cannot be empty";
    }

    const minLength = 8;
    const maxLength = 32;

    if (password.length < minLength) return "Password must be longer than 8 characters.";
    if (password.length > maxLength) return "Password must be shorter than 32 characters.";

    if (ValidateInput(password, "PASSWORD") !== "VALID") {
        return "Invalid Input";
    }

    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).+$/;

    if (!regex.test(password)) {
        return "Password must contain 1 uppercase, 1 number, and 1 special character";
    }


    return "VALID";
};


export function ValidateEmail(email) {

    if (!email) {
        return "Input cannot be empty"
    }

    email = email.trim();

    if (ValidateInput(email, "EMAIL") !== "VALID") {
        return "Invalid Input";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return "Please enter a valid email";

    return "VALID";
};


export function ValidateCode(code, maxDigitsAllowed) {
    if (!code) {
        return "Input cannot be empty";
    }

    const regex = /^[0-9]+$/;

    if (code.length > maxDigitsAllowed) return "Digit limit exceeded";

    if (!regex.test(code)) return "Code must only contain digits";

    return "VALID";
};



export function ValidateURL(url) {

    if (!url) return "URL is required";

    if (url.length < 10) return "URL must be between 10 and 1024 characters";
    if (url.length > 1024) return "URL must be between 10 and 1024 characters";

    const regex = /^(https?:\/\/)?([\w-]+\.)+[a-zA-Z]{2,}/;


    if (!regex.test(url)) return "Please enter a valid URL";
    return "VALID";

}


export function ValidateAlias(alias) {

    if (alias.length < 3) return "Alias must be at least 3 characters";

    if (alias.length > 10) return "Alias must be less than 10 characters";

    if (ValidateInput(alias, "ALIAS") !== "VALID") return "Invalid alias";

    return "VALID";
}


export function ValidateInput(input, type) {

    const allowedMap = {
        GENERAL: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.!? ",
        NAME: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ. ",
        EMAIL: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-+@",
        PASSWORD: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!.@#$%^&* ",
        MESSAGE: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?;:'\"()[]{}-_/@#$%^&*+=|~`",
        ALIAS: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    };

    for (let c of input) {
        if (!allowedMap[type].includes(c)) return "INVALID";
    }

    return "VALID";

}
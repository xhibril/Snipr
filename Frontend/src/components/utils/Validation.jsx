export function ValidatePassword(password) {
  if (!password) {
    return "Password is required";
  }

  const minLength = 8;
  const maxLength = 32;

  if (password.length < minLength)
    return "Password must be longer than 8 characters.";
  if (password.length > maxLength)
    return "Password must be shorter than 32 characters.";

  if (ValidateInput(password, "PASSWORD") !== "VALID") {
    return "Invalid Input";
  }

  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).+$/;

  if (!regex.test(password)) {
    return "Password must contain 1 uppercase, 1 number, and 1 special character";
  }

  return "VALID";
}

export function ValidateEmail(email) {
  if (!email) {
    return "Input cannot be empty";
  }

  email = email.trim();

  if (ValidateInput(email, "EMAIL") !== "VALID") {
    return "Invalid Input";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) return "Please enter a valid email";

  return "VALID";
}

export function ValidateCode(code, maxDigitsAllowed) {
  if (!code) {
    return "Input cannot be empty";
  }

  const regex = /^[0-9]+$/;

  if (code.length > maxDigitsAllowed) return "Digit limit exceeded";

  if (!regex.test(code)) return "Code must only contain digits";

  return "VALID";
}


export function ValidateInput(input, type) {
  const allowedMap = {
    GENERAL:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.!?()0123456789 ",
    NAME: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ. ",
    EMAIL:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-+@",
    PASSWORD:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!.@#$%^&* ",
    MESSAGE:
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,!?;:'\"()[]{}-_/@#$%^&*+=|~`",
    ALIAS: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",

    USERNAME:
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.",
  };

  for (let c of input) {
    if (!allowedMap[type].includes(c)) return "INVALID";
  }

  return "VALID";
}

export function ValidateFileName(name, itemsInSameSpace, type) {

  if (itemsInSameSpace.some((item) => item?.name === name)) {
    return null;
  }

  const isFolder = type === "FOLDER";
  const trimmedName = name?.trim();

  if(!trimmedName){
    name = isFolder ? "New Folder" : "New File"
  } else {
    name = trimmedName;
  }

  if(!itemsInSameSpace.some((item) => item?.name === name)){
    return name;
  }

  let counter = 2;
  
  while(itemsInSameSpace.some((item) => item?.name === `${name} (${counter}`)){
    counter++;
  }


  return `${name} (${counter})`;

}

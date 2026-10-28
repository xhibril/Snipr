const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LETTERS = LOWERCASE_LETTERS + UPPERCASE_LETTERS;
const DIGITS = "0123456789";

const ALLOWED_CHARACTERS_BY_TYPE = {
  GENERAL: `${LETTERS}${DIGITS}.!?() `,

  FILE_NAME: `${LETTERS}${DIGITS}._- `,

  EMAIL: `${LETTERS}${DIGITS}._-+@`,

  PASSWORD: `${LETTERS}${DIGITS}!.@#$%^&* `,

  FILE_CONTENT: `${LETTERS}${DIGITS} .,!?;:'"()[]{}-_/@#$%^&*+=|~\` `,

  USERNAME: `${LETTERS}${DIGITS}_.`,

  TAGS: `${LETTERS}`,
};

export function ValidateInput(input, type) {
  const allowedCharacters = ALLOWED_CHARACTERS_BY_TYPE[type];

  for (const character of input) {
    if (!allowedCharacters.includes(character)) {
      return "INVALID";
    }
  }

  return "VALID";
}

export function ValidatePassword(password, check = "strength") {
  if (!password) {
    return "Enter a password";
  }

  if (check === "required") {
    return "VALID";
  }

  const minLength = 8;
  const maxLength = 32;

  
if (password.length < minLength) {
  return "Password must be at least 8 characters.";
}

if (password.length > maxLength) {
  return "Password must be no more than 32 characters.";
}


  if (ValidateInput(password, "PASSWORD") !== "VALID") {
    return "Invalid Input";
  }

  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.]).+$/;

  if (!regex.test(password)) {
    return "Password must include an uppercase letter, a number, and a special character.";
  }
  return "VALID";
}

export function ValidateEmail(email) {
  if (!email) {
    return "Enter your email address";
  }

  email = email.trim();

  if (ValidateInput(email, "EMAIL") !== "VALID") {
    return "Email address contains unsupported characters.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Enter a valid email address.";
  }

  return "VALID";
}

export function ValidateCode(code, maxDigitsAllowed) {
  if (!code) {
    return "Enter the verification code.";
  }

  const regex = /^[0-9]+$/;

  if (code.length > maxDigitsAllowed) {
    return `Verification code must be no more than ${maxDigitsAllowed} digits.`;
  }

  if (!regex.test(code)) {
    return "Verification code can contain numbers only.";
  }

  return "VALID";
}

export function ValidateUsername(username){

  if(!username){
    return "Enter a username";
  }

  const minLength = 3;
  const maxLength = 20;

  if(username.length < minLength){
    return "Username must be at least 3 characters"
  }

  if(username.legnth > maxLength){
    return "Username must be no more than 20 characters"
  }


  if(ValidateInput(username, "USERNAME") !== "VALID"){
    return "Username can contain letters, numbers, underscores, and periods only.";
  }


  return "VALID";
}



export function ValidateFileName(name, itemsInSameSpace, type) {
  if (itemsInSameSpace.some((item) => item?.name === name)) {
    return null;
  }

  const isFolder = type === "FOLDER";
  const trimmedName = name?.trim();

  if (!trimmedName) {
    name = isFolder ? "New Folder" : "New File";
  } else {
    name = trimmedName;
  }

  if (!itemsInSameSpace.some((item) => item?.name === name)) {
    return name;
  }

  let counter = 2;

  while (
    itemsInSameSpace.some((item) => item?.name === `${name} (${counter}`)
  ) {
    counter++;
  }

  return `${name} (${counter})`;
}

// field validations
const validateUsername = (fields) => {
  if (!fields.username) return "Please enter a username";
  if (/^[a-zA-Z0-9]+$/.test(fields.username)) {
    return true;
  }
  return "Username must consist solely of alphanumeric characters";
};

const validatePassword = (fields) => {
  if (!fields.password)
    return "Need to generate password (encryption/decryption keys)";
  if (fields.password.length >= 20) {
    return true;
  }
  return "Need to generate password (encryption/decryption keys)";
};

const validateFunctions = {
  username: validateUsername,
  password: validatePassword,
};

const validate = (fields, name = null) => {
  let result = null;
  if (name === "password") {
    result = {
      password: validateFunctions.password(fields),
    };
  } else if (name)
    result = {
      [name]: validateFunctions[name](fields),
    };

  if (result) {
    console.log("validated: ", result);
    return result;
  }

  result = {
    username: validateFunctions.username(fields),
    password: validateFunctions.password(fields),
  };

  console.log("validated: ", result);
  return result;
};

const validated = (errors) => {
  console.log("errors: ", errors);
  let result = true;
  for (const x of Object.values(errors)) {
    if (x !== true) result = false;
  }
  return result;
};

export { validate, validated };

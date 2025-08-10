const validator = require("validator");

function validateSignupData(req) {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name must be between 4 and 20 characters.");
  }
  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol."
    );
  }
}

function validateProfileUpdateData(req) {
  const allowedUpdate = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "bio",
    "skills",
    "photoUrl",
  ];
  const isAllowedUpdate = Object.keys(req.body).every((key) =>
    allowedUpdate.includes(key)
  );

  // if (!validator.isLength(req.body.bio, { max: 200})) {
  //   return res.status(400).send("Bio must be less than 200 characters.");
  // }

  // if (!validator.isArray(req.body.skills)) {
  //   return res.status(400).send("Skills must be an array.");
  // }
  // if(!validator.isInt(req.body.age, { min: 18, max: 120 })) {
  //     throw new Error("Age must be a valid number between 18 and 120.");
  //   }
  if (!isAllowedUpdate) {
    throw new Error("Invalid update fields");
  }
  return isAllowedUpdate;
}

module.exports = { validateSignupData, validateProfileUpdateData };

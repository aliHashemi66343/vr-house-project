import { body, check } from "express-validator";
const allowedFields = [ "password", "password_confirmation"];
export const passwordValidation = [

  body("password")
    .exists()
    .withMessage("No Password Entered!")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .isAlphanumeric()
    .withMessage("password should contains alphabet and numeric character"),
  body("password_confirmation")
    .exists()
    .withMessage("Enter password confirmation too!")
    .notEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body().custom((value, { req }) => {
    const sentFields = Object.keys(req.body);
    const extras = sentFields.filter((field) => !allowedFields.includes(field));

    if (extras.length > 0) {
      throw new Error(`Unexpected field(s): ${extras.join(", ")}`);
    }
    return true;
  }),
  body().custom((value, { req }) => {
    const keys = Object.keys(req.query || {});

    keys.forEach((qKey) => {
      if (req.query[qKey].length > 1) {
        throw new Error(`Duplicate query: ${qKey}`);
      }
    });

    return true;
  }),
];


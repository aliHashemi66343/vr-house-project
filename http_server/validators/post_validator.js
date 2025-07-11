import { body, check } from "express-validator";
const allowedFields = ["content", "tags","title"];
export const postValidation = [
  body("content")
    .isLength({ max: 40 })
    .withMessage("content must be at most 40 characters"),

  body("title")
    .exists()
    .withMessage("No title entered!")
    .isLength({ min: 10 })
    .withMessage("the title length should be greater than 10 character"),

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


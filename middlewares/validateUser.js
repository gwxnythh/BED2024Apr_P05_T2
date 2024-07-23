const Joi = require("joi");

const validateUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    username: Joi.string().max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    role: Joi.string().valid("Member", "Instructor", "Examiner", "C.S Staff").optional(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    return res.status(400).json({ message: "Validation error", errors });
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateUser;
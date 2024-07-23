const Joi = require("joi");

const validateQuiz = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),  // Add this line if id is required
    question: Joi.string().min(3).max(255).required(),
    answer: Joi.string().min(1).required(),
    options: Joi.array().items(Joi.string()).min(1).optional() // Optional array of strings for multiple-choice
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateQuiz;

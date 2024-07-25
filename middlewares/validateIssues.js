const { body, validationResult } = require('express-validator');

const validateIssue = [
  body('message').notEmpty().withMessage('Message is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('name').notEmpty().withMessage('Name is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  }
];

module.exports = validateIssue;
const { validationResult } = require("express-validator");

module.exports = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formatedError = {};

    errors.array().forEach((element) => {
      if (element.param in formatedError) {
        formatedError[element.param].push(element.msg);
      } else {
        formatedError[element.param] = [element.msg];
      }
    });

    res.status(422).json({
      errors: formatedError,
    });
  };
};

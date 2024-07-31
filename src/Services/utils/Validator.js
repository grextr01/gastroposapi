const Joi = require("joi");

const validator = schema => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    var message = "";
    for (let key in error.details) {
      var detail = error.details[key];
      message += detail.message + "\n";
    }
    return res.status(400).json({
      message: message
    });
  }
  next();
};

const ProductSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  Price: Joi.number().required(),
  Category: Joi.number().required()
});

module.exports = {
  validateProducts: validator(ProductSchema)
};

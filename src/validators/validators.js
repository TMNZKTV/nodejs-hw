const Joi = require("joi");

const phonePattern = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

const phonePatternError = "Please, check number format";

module.exports = {
  addContactValidation: (req, res, next) => {
    // Объявляему схему валидации
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      phone: Joi.string()
        .pattern(new RegExp(phonePattern), phonePatternError)
        .required(),
    });

    // Проверяем данные клиента на валидацию
    const validationResult = schema.validate(req.body);

    // Если есть ошибка
    if (validationResult.error) {
      return res.status(400).json({ status: validationResult.error.details });
    }

    next();
  },

  updateContactValidation: (req, res, next) => {
    // Объявляему схему валидации
    const schema = Joi.object({
      name: Joi.string().alphanum().min(3).max(20).optional(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .optional(),
      phone: Joi.string()
        .pattern(new RegExp(phonePattern), phonePatternError)
        .alphanum()
        .min(5)
        .max(20)
        .optional(),
      favorite: Joi.boolean().optional(),
    });

    // Проверяем данные клиента на валидацию
    const validationResult = schema.validate(req.body);

    // Если есть ошибка
    if (validationResult.error) {
      return res.status(400).json({ status: validationResult.error.details });
    }

    next();
  },
};

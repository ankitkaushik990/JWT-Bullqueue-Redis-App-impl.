const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  address: Joi.string().min(5).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().min(4).required(),
});

const editSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  address: Joi.string().min(5).required(),
});

module.exports = { userSchema, loginSchema, verifySchema, editSchema };

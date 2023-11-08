const { email_tables, users } = require("../model");

const isEmail = async (email) => {
  const existingEmail = await email_tables.findOne({ where: { email } });
  return !!existingEmail;
};

const isName = async (name) => {
  const existingName = await users.findOne({ where: { name } });
  return !!existingName;
};

module.exports = { isEmail, isName };

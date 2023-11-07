const { email_tables, users } = require("../model"); // Import your database functions

const isEmail = async (email) => {
  const existingEmail = await email_tables(email);
  if (existingEmail) {
    return true;
  }
};

const isName = async (name) => {
  const existingName = await users(name);
  if (existingName) {
    return true;
  }
};
module.exports = { isEmail, isName };

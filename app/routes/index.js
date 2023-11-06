const AuthRoute = require("./auth.routes");
const UserRoute = require("./user.routes");

module.exports = [
  new AuthRoute(),
  new UserRoute(),
];

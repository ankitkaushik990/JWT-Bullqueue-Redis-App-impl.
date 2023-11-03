const { Router } = require("express");
const AuthController = require("../controllers/auth.controller");

class AuthRoute {
  constructor() {
    this.path = "/api/v2/auth/";
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      this.authController.signup.bind(this.authController)
    );
    this.router.post(
      `${this.path}login`,
      this.authController.login.bind(this.authController)
    );
    this.router.post(
      `${this.path}verify`,
      this.authController.verify.bind(this.authController)
    );
  }
}
module.exports = AuthRoute;

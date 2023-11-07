const { Router } = require("express");
const UserController = require("../controllers/user.controller");

class UserRoute {
  constructor() {
    this.path = "/api/v2/user/";
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.put(
      `${this.path}edit`,
      this.userController.edit.bind(this.userController)
    );
      this.router.get(
        `${this.path}all`,
        this.userController.getall.bind(this.userController)
      );
  }
}
module.exports = UserRoute;

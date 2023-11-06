const UserService = require("../services/user.service");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async edit(req, res) {
     await this.userService.edit(req);
    res.status(200).json({  message: "edited successful" });
  }
}

module.exports = UserController;

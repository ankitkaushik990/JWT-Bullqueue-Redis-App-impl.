const UserService = require("../services/user.service");

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async edit(req, res) {
    await this.userService.edit(req);
    res.status(200).json({ message: "edited successful" });
  }
  async getall(req, res) {
  const all=  await this.userService.getall();
    res.status(200).json({ all });
  }
}

module.exports = UserController;

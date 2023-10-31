const AuthService = require("../services/auth.service");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signup(req, res) {
    const userData = req.body; 
    await this.authService.signup(userData);
    res.status(200).json({ message: "signup successful" });
  }

}

module.exports = AuthController;

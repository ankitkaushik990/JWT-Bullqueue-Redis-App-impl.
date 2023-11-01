const AuthService = require("../services/auth.service");

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signup(req, res) {
    const userData = req.body; 
   let final = await this.authService.signup(userData);
   res.status(200).json({ final, message: "signup successful" });
  }

}

module.exports = AuthController;

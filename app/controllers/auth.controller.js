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

  async login(req, res) {
    const loginData = req.body;
   const loginDetail = await this.authService.login(loginData);
   res
     .status(200)
     .json({ message: "lowgin successfull, Enter OTP ", loginDetail });
  }
}

module.exports = AuthController;

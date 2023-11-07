const redis = require("../utils/redisUtils");
const bcrypt = require("bcrypt");

const twilioUtils = require("../utils/twilioUtils");
const jwtUtils = require("../utils/jwtUtils");
const { users, phone_tables, email_tables } = require("../model");
const { isEmpty } = require("../utils/empty");
const { isEmail } = require("../utils/checkEmail");
const { HttpException } = require("../errors/HttpException");
const setupQueue = require("../utils/queue");
const randomNumberQueue = setupQueue(); 

class AuthService {
  async signup(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Request body is empty");
    }
    if (isEmail(userData.email)) {
      throw new HttpException(400, "email already exists");
    }
    let createdUser;
    if (userData.name) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      createdUser = await users.create({
        name: userData.name,
        password: hashedPassword,
      });

      if (userData.phone) {
        await phone_tables.create({
          phone: userData.phone,
          userId: createdUser.id,
        });
      }
      let final;
      if (userData.email) {
        console.log(userData.email);
        final = await email_tables.create({
          email: userData.email,
          userId: createdUser.id,
        });
      }
       randomNumberQueue.add({ userId: createdUser.id });
      return final;
    } else {
      throw new HttpException(400, "User name is required");
    }
  }

  async login(loginData) {
    if (isEmpty(loginData)) {
      throw new HttpException(400, "Request body is empty");
    }
    const emailRecord = await email_tables.findOne({
      where: { email: loginData.email },
      include: [
        {
          model: users,
          as: "user",
        },
      ],
    });

    if (!emailRecord) {
      throw new HttpException(400, "Email not found");
    }

    const findUser = emailRecord.user;
    if (findUser) {
      const isPasswordMatching = await bcrypt.compare(
        loginData.password,
        findUser.password
      );
      if (!isPasswordMatching) {
        throw new HttpException(409, "Password is incorrect");
      }

      const phoneRecord = await phone_tables.findOne({
        where: { userId: emailRecord.user.id },
      });

      if (phoneRecord && phoneRecord.phone) {
        const otp = Math.floor(1000 + Math.random() * 9000);
        // try {
        // await twilioUtils.sendOTPToPhoneNumber(phoneRecord.phone, otp);
        redis.set(emailRecord.email, otp, (err, result) => {
          if (err) {
            throw new HttpException(403, "Error in setting details");
          } else {
            redis.expire(emailRecord.email, 180);
          }
        });
        return { findUser, otp };
      }
      // catch (error) {
      //   console.error("Error sending OTP via Twilio:", error);
      //   throw new HttpException(500, "Error sending OTP via Twilio");
      // }
      // }
    } else {
      throw new HttpException(400, "user not found");
    }
    return { findUser };
  }

  async verify(verifyData) {
    if (isEmpty(verifyData)) {
      throw new HttpException(400, "Request body is empty");
    }

    const { email, otp } = verifyData;

    const emailRecord = await email_tables.findOne({
      where: { email },
      include: [
        {
          model: users,
          as: "user",
        },
      ],
    });

    if (!emailRecord || !emailRecord.user) {
      throw new HttpException(400, "not such email found");
    }

    const user = emailRecord.user;
    const payload = { user };

    const token = jwtUtils.generateToken(payload);
    try {
      const storedOTP = await redis.get(email);

      if (storedOTP === otp.toString()) {
        return token;
      } else {
        throw new HttpException(401, "Not authorized: Invalid OTP");
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(500, error.message);
    }
  }
}

module.exports = AuthService;

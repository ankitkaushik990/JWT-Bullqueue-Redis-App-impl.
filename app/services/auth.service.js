const redis = require("../utils/redisUtils");
const bcrypt = require("bcrypt");

const twilioUtils = require("../utils/twilioUtils");
const jwtUtils = require("../utils/jwtUtils");
const { users, phone_tables, email_tables } = require("../model");
const { isEmail } = require("../utils/checkEmail");
const { isEmpty } = require("../utils/empty");
const { HttpException } = require("../errors/HttpException");
const {
  userSchema,
  loginSchema,
  verifySchema,
} = require("../validators/joi.validator");
const setupQueue = require("../utils/queue");
const randomNumberQueue = setupQueue();

class AuthService {
  async signup(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, "Request body is empty");
    }
    const { error } = userSchema.validate(userData);
    if (error) {
      throw new HttpException(400, error.details[0].message);
    }
    const emailExists = await isEmail(userData.email);

    if (emailExists) {
      throw new HttpException(400, "Email Already Exists");
    }

    let createdUser;
    if (userData.name) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      createdUser = await users.create({
        name: userData.name,
        password: hashedPassword,
        address: userData.address,
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

    const { error } = loginSchema.validate(loginData);

    if (error) {
      throw new HttpException(400, error.details[0].message);
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
      let otp = null;
      const phoneRecord = await phone_tables.findOne({
        where: { userId: emailRecord.user.id },
      });

      if (phoneRecord && phoneRecord.phone) {
        otp = Math.floor(1000 + Math.random() * 9000);
        try {
          await twilioUtils.sendOTPToPhoneNumber(phoneRecord.phone, otp);
          redis.set(emailRecord.email, otp, (err, result) => {
            if (err) {
              throw new HttpException(403, "Error in setting details");
            } else {
              redis.expire(emailRecord.email, 180);
            }
          });
        } catch (error) {
          console.error("Error sending OTP via Twilio:", error);
          throw new HttpException(500, "Error sending OTP via Twilio");
        }
      }

      return { findUser, otp };
    } else {
      throw new HttpException(400, "User not found");
    }
  }

  async verify(verifyData) {
    if (isEmpty(verifyData)) {
      throw new HttpException(400, "Request body is empty");
    }
    const { error } = verifySchema.validate(verifyData);
    if (error) {
      throw new HttpException(400, error.details[0].message);
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
        await redis.del(email);
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

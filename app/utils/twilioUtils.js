const { ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER } = require("../../config/env");
const twilio = require("twilio");

function sendOTPToPhoneNumber(phoneNumber, otp) {
  const twilioClient = twilio(ACCOUNT_SID, AUTH_TOKEN);

  return twilioClient.messages.create({
    body: `Your OTP for Verification is: ${otp}`,
    from: PHONE_NUMBER,
    to: phoneNumber,
  });
}

module.exports = {
  sendOTPToPhoneNumber,
};

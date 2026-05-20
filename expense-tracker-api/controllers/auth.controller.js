const bcrypt = require("bcrypt");
const prisma = require("@prisma/client").PrismaClient;
const generateToken = require("../utils/generateToken");

const prismaClient = new prisma();
const resend = require("../utils/resend");

exports.register = async (req, res) => {
    console.log("RAW BODY:", req.body);
  try {
    const { email, password } = req.body;
    console.log("BODY:", req.body);

    const existingUser = await prismaClient.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

const otpExpiry = new Date(
  Date.now() + 5 * 60 * 1000
);

    const user = await prismaClient.user.create({

  data: {

    email,

    password: hashedPassword,

    verified: false,

    otp,

    otpExpiry

  }

});

try {

  const response =
    await resend.emails.send({

      from: "onboarding@resend.dev",

      to: email,

      subject: "Verify Your Email",

      html: `
        <h1>Your OTP is ${otp}</h1>
      `
    });

  console.log(
    "EMAIL RESPONSE:",
    response
  );

} catch (err) {

  console.error(
    "RESEND ERROR:",
    err
  );

  return res.status(500).json({

    message:
      "Failed to send OTP email"

  });

}

    res.status(201).json({

  message:
    "OTP sent to your email",

  email: user.email

});

  } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
}
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {

  return res.status(401).json({

    message:
      "Verify your email first"

  });

}

    res.json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id)
    });

  } catch (error) {
  console.error(error);
  res.status(500).json({ message: error.message });
}
};

exports.verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user =
      await prismaClient.user.findUnique({

        where: { email }

      });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    if (user.otp !== otp) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    if (new Date() > user.otpExpiry) {

      return res.status(400).json({
        message: "OTP expired"
      });

    }

    await prismaClient.user.update({

      where: { email },

      data: {

        verified: true,

        otp: null,

        otpExpiry: null

      }

    });

    res.json({

      message:
        "Email verified successfully"

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }

};
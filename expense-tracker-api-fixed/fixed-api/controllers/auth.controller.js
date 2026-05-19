const bcrypt = require("bcrypt");
const prisma = require("@prisma/client").PrismaClient;
const generateToken = require("../utils/generateToken");

const prismaClient = new prisma();

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

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      token: generateToken(user.id)
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
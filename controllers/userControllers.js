import { getHashedPassword } from "../config/passwordHashing.js";
import { generateToken } from "../config/tokens.js";
import { User } from "../models/UsersModel.js";
import bcrypt from "bcrypt";

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Enter all the required fields" });
    }

    if(password.length < 5){
      return res
        .status(400)
        .send({ message: "Password should have atleast 5 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .send({ message: "User already exists with this email" });
    }

    const hashedPassword = await getHashedPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(400).send({ message: "Registration failed" });
    }

    res.status(200).send({
      message: "Registration completed successfully",
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Enter all the required fields" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const checkPassword = await bcrypt.compare(password, userExists.password);
    if (!checkPassword) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = generateToken(
      {
        _id: userExists._id,
      },
      "1h"
    );

    res.status(200).send(token);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findOne(
      { _id },
      { password: 0, createdAt: 0, updatedAt: 0 }
    );
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

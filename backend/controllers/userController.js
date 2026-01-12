import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

// route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// route for user registerUser

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // password must be greater than 8
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // check user already exist or not
    const exist = await userModel.findOne({ email });
    if (exist) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // if not exist then
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    const token = jwt.sign ({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "6h"});

    res.status(201).json({
      success: true,
      token,
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while registering user",
    });
  }
};

// route for admin login

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All field are required",
      });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {expiresIn: "6h",});
      res.json({
        success: true,
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { loginUser, registerUser, adminLogin };
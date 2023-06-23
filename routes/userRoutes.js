import express from "express";
import { getUserDetails, userLogin, userSignup } from "../controllers/userControllers.js";
import { authMiddleware } from "../config/authMiddleware.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/", authMiddleware, getUserDetails);

export const userRouter = router;

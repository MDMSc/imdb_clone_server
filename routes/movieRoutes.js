import express from "express";
import {
  createMovie,
  editMovie,
  getSearchMovieList,
  getOneMovie,
} from "../controllers/movieController.js";
import { authMiddleware } from "../config/authMiddleware.js";

const router = express.Router();

router.post("/add-movie", authMiddleware, createMovie);
router.get("/:_id", authMiddleware, getOneMovie);
router.get("/", authMiddleware, getSearchMovieList);
router.put("/edit-movie/:_id", authMiddleware, editMovie);

export const movieRouter = router;

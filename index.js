import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoutes.js";
import { actorRouter } from "./routes/actorRoutes.js";
import { movieRouter } from "./routes/movieRoutes.js";
import { producerRouter } from "./routes/producerRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.status(200).send("IMDB Clone App");
});

app.use("/api/users", userRouter);
app.use("/api/actors", actorRouter);
app.use("/api/movies", movieRouter);
app.use("/api/producers", producerRouter);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));

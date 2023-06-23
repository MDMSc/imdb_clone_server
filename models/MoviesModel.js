import mongoose from "mongoose";

const movieSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    year_of_release: {
      type: Number,
      required: true,
      min: [1900, "Year of release cannot be less than 1900"],
      max: [2999, "Year of release cannot be more than 2999"],
    },
    plot: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      required: true,
      default:
        "https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg",
    },
    actors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      multiple: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

export const Movie = mongoose.model("Movie", movieSchema);

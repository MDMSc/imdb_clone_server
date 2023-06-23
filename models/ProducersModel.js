import mongoose from "mongoose";

const producerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function(input){
          return new Date(input) < new Date();
        },
        message: props => `Invalid date for ${props.path}. DOB must be less than current date.`
      }
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Producer = mongoose.model("Producer", producerSchema);

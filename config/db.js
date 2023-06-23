import mongoose from "mongoose";

mongoose.set("strictQuery", "false");

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((data) => console.log(`Database connection established: ${data.connection.host}`))
    .catch((error) => {
        console.log(`Error in database connection: ${error.message}`);
        process.exit();
    })
};

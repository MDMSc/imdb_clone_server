import { Actor } from "../models/ActorsModel.js";
import { Movie } from "../models/MoviesModel.js";
import { Producer } from "../models/ProducersModel.js";

export const createMovie = async (req, res) => {
  try {
    const { name, year_of_release, plot, poster, actors, producer } = req.body;

    if (!name || !year_of_release || !plot || !producer) {
      return res.status(400).send({ message: "Enter all the required fields" });
    }

    const actorsList = JSON.parse(actors);
    if (!actorsList.length) {
      return res
        .status(400)
        .send({ message: "Need to have atleast one actor" });
    }

    const movie = await Movie.create({
      name,
      year_of_release,
      plot,
      poster,
      actors: actorsList,
      producer,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    if (!movie) {
      return res.status(400).send({ message: "Movie not added" });
    }

    // add movie to actors, producers
    const updateProducer = await Producer.findByIdAndUpdate(
      { _id: producer },
      {
        $push: { movies: movie._id },
        updatedBy: req.user._id,
      },
      { new: true, rawResult: true }
    );

    actorsList.forEach(
      async (_id) =>
        await Actor.findByIdAndUpdate(
          { _id },
          {
            $push: { movies: movie._id },
            updatedBy: req.user._id,
          },
          { new: true, rawResult: true }
        )
    );

    const getMovie = await Movie.findOne({ _id: movie._id })
      .populate("actors", "_id name gender dob bio")
      .populate("producer", "_id name gender dob bio")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    res.status(200).send(getMovie);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getOneMovie = async (req, res) => {
  try {
    const { _id } = req.params;

    const movie = await Movie.findOne({ _id })
      .populate("actors", "_id name gender dob bio")
      .populate("producer", "_id name gender dob bio")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    if (!movie) {
      return res.status(400).send({ message: "Movie not found" });
    }

    res.status(200).send(movie);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getSearchMovieList = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const movie = await Movie.find(keyword)
      .populate("actors", "_id name gender dob bio")
      .populate("producer", "_id name gender dob bio")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    res.status(200).send(movie);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const editMovie = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, year_of_release, plot, poster, actors, producer } = req.body;

    const movie = await Movie.findOne({ _id });
    if (!movie) {
      return res.status(400).send({ message: "Movie not found" });
    }

    let newActors;
    let oldActors;
    if (actors && actors.length) {
      newActors = JSON.parse(actors);
      oldActors = movie.actors.map((a) => a.toString());

      if (!newActors.length) {
        return res
          .status(400)
          .send({ message: "Need to have atleast one actor" });
      }
    }

    const oldProducer = movie.producer.toString();

    const updateMovie = await Movie.findByIdAndUpdate(
      { _id },
      {
        name,
        year_of_release,
        plot,
        poster,
        actors: newActors,
        producer,
        updatedBy: req.user._id,
      },
      {
        new: true,
        rawResult: true,
      }
    );

    if (updateMovie.lastErrorObject.n <= 0) {
      return res.status(500).send({ message: "Internal issue" });
    }

    if (producer && producer !== oldProducer) {
      const newProducerUpdate = await Producer.findByIdAndUpdate(
        { _id: producer },
        {
          $push: { movies: _id },
          updatedBy: req.user._id,
        },
        { new: true, rawResult: true }
      );

      const oldProducerUpdate = await Producer.findByIdAndUpdate(
        { _id: oldProducer },
        {
          $pull: { movies: _id },
          updatedBy: req.user._id,
        },
        { new: true, rawResult: true }
      );

      if (
        newProducerUpdate.lastErrorObject.n <= 0 ||
        oldProducerUpdate.lastErrorObject.n <= 0
      ) {
        return res.status(500).send({ message: "Internal issue" });
      }
    }

    if (actors && actors.length) {
      oldActors.forEach(async (oldVal) => {
        await Actor.findByIdAndUpdate(
          { _id: oldVal },
          {
            $pull: { movies: _id },
            updatedBy: req.user._id,
          },
          { new: true, rawResult: true }
        );
      });

      newActors.forEach(async (val) => {
        await Actor.findByIdAndUpdate(
          { _id: val },
          {
            $push: { movies: _id },
            updatedBy: req.user._id,
          },
          { new: true, rawResult: true }
        );
      });
    }

    const getMovie = await Movie.findOne({ _id })
      .populate("actors", "_id name gender dob bio")
      .populate("producer", "_id name gender dob bio")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    res.status(200).send(getMovie);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

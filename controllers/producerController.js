import { Actor } from "../models/ActorsModel.js";
import { Producer } from "../models/ProducersModel.js";

export const createProducer = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    if (!name || !gender || !dob || !bio) {
      return res.status(400).send({ message: "Enter all the required fields" });
    }

    const producer = await Producer.create({
      name,
      gender,
      dob,
      bio,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    if (!producer) {
      return res.status(400).send({ message: "Producer not added" });
    }

    let getProducer = await Producer.findOne({ _id: producer._id }).populate(
      "movies"
    );

    getProducer = await Actor.populate(getProducer, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    getProducer = await Producer.populate(getProducer, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(getProducer);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getOneProducer = async (req, res) => {
  try {
    const { _id } = req.params;

    let producer = await Producer.findOne({ _id })
      .populate("movies")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    if (!producer) {
      return res.status(400).send({ message: "Producer not found" });
    }

    producer = await Actor.populate(producer, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    producer = await Producer.populate(producer, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(producer);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getSearchProducerList = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    let producer = await Producer.find(keyword)
      .populate("movies")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    producer = await Actor.populate(producer, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    producer = await Producer.populate(producer, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(producer);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const editProducer = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, gender, dob, bio } = req.body;

    const updateProducer = await Producer.findByIdAndUpdate(
      { _id },
      {
        name,
        gender,
        dob,
        bio,
        updatedBy: req.user._id,
      },
      {
        new: true,
        rawResult: true,
      }
    );

    if (updateProducer.lastErrorObject.n <= 0) {
      return res.status(500).send({ message: "Internal issue" });
    }

    let getProducer = await Producer.findOne({ _id }).populate("movies");
    getProducer = await Actor.populate(getProducer, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    getProducer = await Producer.populate(getProducer, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(getProducer);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

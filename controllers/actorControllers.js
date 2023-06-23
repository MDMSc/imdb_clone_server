import { Actor } from "../models/ActorsModel.js";
import { Producer } from "../models/ProducersModel.js";

export const createActor = async (req, res) => {
  try {
    const { name, gender, dob, bio } = req.body;

    if (!name || !gender || !dob || !bio) {
      return res.status(400).send({ message: "Enter all the required fields" });
    }

    const actor = await Actor.create({
      name,
      gender,
      dob,
      bio,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    if (!actor) {
      return res.status(400).send({ message: "Actor not added" });
    }

    let getActor = await Actor.findOne({ _id: actor._id }).populate("movies");

    getActor = await Actor.populate(getActor, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    getActor = await Producer.populate(getActor, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(getActor);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getOneActor = async (req, res) => {
  try {
    const { _id } = req.params;

    let actor = await Actor.findOne({ _id })
      .populate("movies")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    if (!actor) {
      return res.status(400).send({ message: "Actor not found" });
    }

    actor = await Actor.populate(actor, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    actor = await Producer.populate(actor, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(actor);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const getSearchActorList = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    let actor = await Actor.find(keyword)
      .populate("movies")
      .populate("createdBy", "-password")
      .populate("updatedBy", "-password");

    actor = await Actor.populate(actor, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    actor = await Producer.populate(actor, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(actor);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

export const editActor = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, gender, dob, bio } = req.body;

    const updateActor = await Actor.findByIdAndUpdate(
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

    if (updateActor.lastErrorObject.n <= 0) {
      return res.status(500).send({ message: "Internal issue" });
    }

    let getActor = await Actor.findOne({ _id }).populate("movies");
    getActor = await Actor.populate(getActor, {
      path: "movies.actors",
      select: "_id name gender dob bio",
    });

    getActor = await Producer.populate(getActor, {
      path: "movies.producer",
      select: "_id name gender dob bio",
    });

    res.status(200).send(getActor);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

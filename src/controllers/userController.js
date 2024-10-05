import User from "./../models/user.model.js"
import handlerFactory from "./handlerFactory.js";

const getAllusers = handlerFactory.getAll(User)
const createUser = handlerFactory.CreateOne(User)
const getUser = handlerFactory.getOne(User)
const deleteUser = handlerFactory.deleteOne(User)
const updateUser = handlerFactory.updateOne(User)


export default {
    getAllusers,
    updateUser,
    deleteUser,
    getUser,
    createUser,

};


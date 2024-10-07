import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import User from "./../models/user.model.js"
import handlerFactory from "./handlerFactory.js";



const filterObj = (obj, ...allowField) => {
    const newObj = {}
    Object.keys(obj).forEach((el) => {
        if (allowField.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}

const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('This route is not for password updates. Please use /updatePassword.',
            400))
    }
    const filterobject = filterObj(req.body, 'name', 'email')
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterobject, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        status: "success",
        data: updatedUser
    })

})


const deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const getAllUsers = handlerFactory.getAll(User)
const createUser = handlerFactory.CreateOne(User)
const getUser = handlerFactory.getOne(User)
const deleteUser = handlerFactory.deleteOne(User)
const updateUser = handlerFactory.updateOne(User)


export default {
    getAllUsers,
    updateUser,
    deleteUser,
    getUser,
    createUser,
    updateMe,
    deleteMe

};


import express from "express"
import userController from "./../controllers/userController.js"
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/signUp", authController.signUp)

router.post("/logIn", authController.logIn)

router.post("/forgetPassword", authController.forgetPassword)

router.patch('/resetPassword/:token', authController.resetPassword)


router.route("/")
    .get(userController.getAllusers)
    .post(userController.createUser)

router.route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


export default router;    
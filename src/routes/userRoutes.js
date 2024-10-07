import express from "express"
import userController from "./../controllers/userController.js"
import authController from "../controllers/authController.js";
import uploadmiddleware from "./../middlewares/uploadImage.js"

const router = express.Router();

router.post("/signUp", authController.signUp)

router.post("/logIn", authController.logIn)

router.post("/forgetPassword", authController.forgetPassword)

router.patch('/resetPassword/:token', authController.resetPassword)


router.use(authController.protect)

router.patch('/updatePassword', authController.updatePassword)

router.patch('/updateMe',
    uploadmiddleware.uploadImage,
    uploadmiddleware.uploadResizeImage,
    userController.updateMe);
router.delete('/deleteMe', userController.deleteMe)

router.use(authController.restrictTo('admin'));

router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route("/:id")
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


export default router;    
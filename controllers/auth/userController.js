import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { UserModel } from "../../models";
import bcrypt from "bcrypt";

const userController = {
    async getUser(req, res, next) {
        try {
            const user = await UserModel.findOne({ _id: req.userInDB._id }).select('-password');
            if (!user) {
                return next(CustomeErrorHandler.userNotFound("User is not found in your DB"));
            }
            res.json(user);
            console.log("User is: ", user);

        } catch (err) {
            return next(err);
        }
    },


    async getAllUser(req, res, next) {
        let allUser;

        try {
            allUser = await UserModel.find().select('-password');
            return res.json(allUser);
        } catch (err) {
            return next(CustomeErrorHandler.serverError("Can not get all user. error from userController.js"))
        }

    },

    async deleteUser(req, res, next) {
        const dropUser = await UserModel.findByIdAndRemove({ _id: req.params.id });
        if (!dropUser) {
            return next(new Error("No user is found for deletion"));
        }
        res.json(dropUser).status(200);
    },

    async updateUser(req, res, next) {
        try {
            console.log(req.body)
            
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const userData = req.body;

            const userExist = await UserModel.findOne({ email: req.body.email });

            if (userExist) {
                return next(
                  CustomeErrorHandler.alreadyExist(
                    "Use Different Email, this email is already taken"
                  )
                );
              }

            const updatedUser = await UserModel.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    "name": req.body.name,
                    "email": req.body.email,
                    "username":req.body.username,
                    "role": req.body.role,
                    "phone":req.body.phone,
                    "password": hashedPassword
                }
            }, { new: true });
            res.status(200).json(updatedUser);

        } catch (err) {
            res.status(520).json({ message: err.message });
        }
    },

    async getuserinfo(req, res, next){
        try{
            const userInfo = await UserModel.findOne({ _id: req.params.id }).select("-password");
            if (!userInfo) {
                return next(CustomeErrorHandler.userNotFound("User Info is not found in your DB"));
            }
            console.log("User is: ", userInfo);
            return res.json(userInfo);
        }catch(err){
            res.status(530).json({ message: err.message })
        }
    }
}

export default userController;
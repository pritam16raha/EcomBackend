import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { UserModel } from "../../models";

const userController = {
    async getUser(req, res, next){
        try{
            const user = await UserModel.findOne({ _id: req.userInDB._id }).select('-password');
            if(!user){
                return next(CustomeErrorHandler.userNotFound("User is not found in your DB"));
            }
            res.json(user);
            console.log("User is: ", user);

        }catch(err){
            return next(err);
        }
    }
}

export default userController;
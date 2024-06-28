import CustomeErrorHandler from "../customError/CustomErrorHandler";
import { UserModel } from "../models";
import { ADMIN } from "../config";

const admin = async(req, res, next) => {
    try{
        const user = await UserModel.findOne({ _id: req.userInDB._id });
        if(user.role === "admin" && user.email === ADMIN){
            next();
        }
         else{
            return next( CustomeErrorHandler.unauthorisedToken() );
         }
    }catch(err){
        return next(CustomeErrorHandler.serverError("error outside from admin catch block"));
    }
}

export default admin;
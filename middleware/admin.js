import CustomeErrorHandler from "../customError/CustomErrorHandler";
import { UserModel } from "../models";
// import { ADMIN } from "../config";

const admin = async(req, res, next) => {
    try{
        const user = await UserModel.findOne({ _id: req.userInDB._id });
        if(user.role === "admin"){
            next();
        }
         else{
            return next( CustomeErrorHandler.unauthorisedToken("user is not admin, be an admin first to access this data") );
         }
    }catch(err){
        return next(CustomeErrorHandler.serverError("error outside from admin.js try block"));
    }
}

export default admin;

//if(user.role === "admin" && user.email === ADMIN) "replace the line 8 with this, if required"
import CustomeErrorHandler from "../customError/CustomErrorHandler";

const adminCheck = async(req, res, next) => {
    try{
        console.log("user in database: ",req.userInDb)
        // let getAdmin = req.headers.authorization;
        // console.log("Admin Access Token is: ", getAdmin);
    }catch(err){
        return next (CustomeErrorHandler.unauthorisedToken("Error from adminCheck.js"))
    }
}

export default adminCheck;
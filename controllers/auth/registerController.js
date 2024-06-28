import Joi, { string } from "joi";
import { UserModel, refreshTokenModel } from "../../models";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import bcrypt from "bcrypt";
import JwtServices from "../../JWTservices/JwtServices";
import { REFRESHKEY } from "../../config";

const registerController = {
  async register(req, res, next) {
    //validation
    const registerSchema = Joi.object({
      name: Joi.string().min(5).required(),
      email: Joi.string().email().required(),
      username: Joi.string().min(6).required(),
      password: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeatPassword: Joi.ref("password"),
    });

    //console.log(req.body);
    const { error } = registerSchema.validate(req.body); //error from postman json body

    if (error) {
      return next(error); //bcz from inside async function we can not throw error. as middleware would not catch it(throw error).
    }
    //if no error found during joi validation, then code will come here, i can write the next logic here
    try {
      const userExist = await UserModel.findOne({ email: req.body.email });
      //console.log(userExist);

      if (userExist) {
        return next(
          CustomeErrorHandler.alreadyExist(
            "Use Different Email, this email is already taken"
          )
        );
      }
    } catch (err) {
      return next(err); //if user is not found in the database
    }

    //logic to store data in PritamCluster01EcomDB
    //hashed password to be saved in userData, plain password is vulnerable
    //const{name, email, username, password} = req.body;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //now save the data inside MyEcomBackEnd
    //const { name, username, email, password } = req.body;
    const myUser = new UserModel({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    let accessToken;
    let refreshToken;

    //saving the data now
    try {
      const userDataResult = await myUser.save();
      console.log(userDataResult)

      //sending the token to the client. if you dont know, what token do, please more ja!
      accessToken = JwtServices.sign({ _id: userDataResult._id , role: userDataResult.role })
      //console.log(accessToken);
      refreshToken = JwtServices.sign({ _id: userDataResult._id , role: userDataResult.role}, '365d' , REFRESHKEY)

      //saving the refresh token in refreshToken collection
      await refreshTokenModel.create({ Ref_Token: refreshToken })

    } catch (err) {
      CustomeErrorHandler.UserDataNotSaved(
        "May be mongoDb error, user data can not be saved in EcomBackEnd"
      );
    }
    
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  },
};

export default registerController;

import Joi from "joi";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { UserModel, refreshTokenModel } from "../../models";
import JwtServices from "../../JWTservices/JwtServices";
import { REFRESHKEY } from "../../config";

const refreshController = {
    async refreshMethod(req, res, next){
        //login validation using Joi
        const refreshSchema = Joi.object({
            Ref_Token_From_Db: Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if(error){
            return next(CustomeErrorHandler.voidToken("Joi validation is failed"));
        }

        let refreshToken;
        try{
            refreshToken = await refreshTokenModel.findOne({ Ref_Token: req.body.Ref_Token_From_Db });
            if(!refreshToken){
                return next(CustomeErrorHandler.voidToken('sending a wrong token or browser token is tampered'));
            }
            let userId;
            try{
                const{_id} = await JwtServices.verify(refreshToken.Ref_Token, REFRESHKEY);
                userId = _id;
            } catch(err){
                return next (CustomeErrorHandler.voidToken("Jwt verification is Failed for refresh token"));
            }

            //now verifying user is present in DB or not
            const user = await UserModel.findOne({ _id: userId });
            if(!user){
                return new(CustomeErrorHandler.userNotFound("user is not present in your DB"));
            }

            //now generate new access token using refresh token
            const newAccessToken = JwtServices.sign({ _id: user._id, role: user.role }, '180d');
            //without refresh token, access token is useless, so sending the refresh token again
            const newRefreshToken = JwtServices.sign({ _id: user._id, role: user.role }, '365d', REFRESHKEY);
            await refreshTokenModel.create({ Ref_Token: newRefreshToken });
            res.json({ newAccessToken, newRefreshToken })


        }catch(err){
            return next(new Error((err.message)));
        }
    }
}

export default refreshController;
import Joi from "joi";
import { UserModel, refreshTokenModel } from "../../models";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import bcrypt from 'bcrypt';
import JwtServices from "../../JWTservices/JwtServices";
import { REFRESHKEY } from "../../config";

const loginController = {
    async login(req, res, next) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
        });

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {

            const user = await UserModel.findOne({ email: req.body.email });

            if (!user) {
                return next(CustomeErrorHandler.WrongEmail("Email is not registerd, please create an account first"))
            }
            //console.log(user)
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (!passwordMatch) {
                return next(CustomeErrorHandler.WrongPassword("password is wrong"));
            }

            //generating acess token/refresh token for the user now
            const accessToken = JwtServices.sign({ _id: user.id, role: user.role });
            //console.log(accessToken)

            const refreshToken = JwtServices.sign({ _id: user._id, role: user.role }, '1y', REFRESHKEY);

            await refreshTokenModel.create({ Ref_Token: refreshToken })

            res.json({ access_Token: accessToken, refresh_Token: refreshToken })


        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        //1st joi validation
        const refreshTokenSchema = Joi.object({
            ref_token: Joi.string().required()
        });

        const { error } = refreshTokenSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let refreshToken;
        try {
            refreshToken = await refreshTokenModel.findOne({ Ref_token: req.body.ref_token });

            if (!refreshToken) {
                return next(CustomeErrorHandler.unauthorisedToken("Only registered user can logout"));
            }

            try {
                await refreshTokenModel.deleteOne({ Ref_Token: req.body.ref_token })
            } catch (err) {
                return next(CustomeErrorHandler.voidToken("token is not found in DB"))
            }
        } catch (err) {
            return next(new Error("logout was unsuccessfull"));
        }

        res.json({ status: 1 })
    }
}

export default loginController;
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { productModel } from "../../models";

const getAllProduct = {
    async getAll(req, res, next) {
        let document;

        try{
            document = await productModel.find().select('-password').sort({ price: 1});
        } catch(err){
            return next(CustomeErrorHandler.serverError("Can not get the all product deu to the server error"));
        }
        return res.json(document);
    }
}

export default getAllProduct;
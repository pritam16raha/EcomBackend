import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { productModel } from "../../models";

const getOneProduct = {
    async getOne(req, res, next){
        let document ;

        try{
            document = await productModel.findById({ _id: req.params.id });

            if(!document){
                return next(CustomeErrorHandler.serverError());
            }
        }catch(err){
            return next(CustomeErrorHandler.serverError("product is not found in Database"));
        }
        res.json(document);
    }
}

export default getOneProduct;
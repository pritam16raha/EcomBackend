import { STATUS_CODES } from "http";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { productModel } from "../../models";
import fs from 'fs';

const deleteProduct = {
    async destroy(req, res, next) {
        const document = await productModel.findOneAndRemove({ _id: req.params.id });
        if(!document){
            return next(new Error("Nothing is there to be deleted"));
        }

        const imagePath = document.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomeErrorHandler.serverError("Error from delete product model"));
            }
        })
        res.json(document);
    }
}

export default deleteProduct;
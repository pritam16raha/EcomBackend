import multer from "multer";
import path from 'path';
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import Joi, { date } from "joi";
import productJoiSchema from "../../validator/productValidate";
import fs from 'fs';
import { productModel } from "../../models";
    
    const imageStorage = multer.diskStorage({
        destination: ( req, file, cb ) => {cb(null, './assets/productImage')},
        filename: ( req, file, cb ) => {
            const uniqueImageName = Date.now() + '-' + Math.round(Math.random() * 1E9 )+".jpeg";
            cb(null, file.fieldname+uniqueImageName);
        }
    });

    const imageData = multer({ storage: imageStorage, limits: { fileSize: 1000000 * 10 } }).single('image');
    
    
const productController = {    

    async addProduct(req, res, next){
        imageData(req, res, async (err) => {
            if(err){
                return next(CustomeErrorHandler.multerError(err.message));
            }
            console.log(req.file);
            const filePath = req.file.path;

            //const { error } = productJoiSchema.validate(req.body);

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                category: Joi.string().required(),
                imagae: Joi.string()
            })

            const { error } = productSchema.validate(req.body);

            if(error){
                fs.unlink(`${appRoot}/${filePath}`, (err) => { //appRoot is global variable. 
                    if(err){
                        return next(CustomeErrorHandler.multerError(err.message))
                    }
                });
                return next(error);
            }

            const { name, price, category } = req.body;
            let document;

            try{
                document = await productModel.create({
                    name: name,
                    price: price,
                    category: category,
                    image: filePath
                });
            }catch(err){
                return next(err);
            }

            res.status(200).json(document);

        });
    }
}

export default productController;
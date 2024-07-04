import multer from "multer";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import Joi from "joi";
import fs from 'fs';
import { productModel } from "../../models";
import productJoiSchema from "../../validator/productValidate";


const newImageStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './assets/productImage') },
    filename: (req, file, cb) => {
        const newUniqueImage = Date.now() + '-' +Math.round(Math.random() * 1E9 )+".jpeg";
        cb(null, file.fieldname+newUniqueImage);
    }
});

const newImageData = multer({ storage: newImageStorage, limits: {fileSize: 1000000 * 10} }).single('image');

const updateController = {
    async updateProduct(req, res, next){
        newImageData (req, res, async (err) => {
            if(err){
                return next(CustomeErrorHandler.multerError(err.message));
            }

            console.log(req.file);

            let newFilePath;

            if(req.file){
                newFilePath = req.file.path;
            }

            // const productSchema = Joi.object({
            //     name: Joi.string().required(),
            //     price: Joi.number().required(),
            //     category: Joi.string().required(),
            //     image: Joi.string()
            // });

            //const { error } = productSchema.validate(req.body);

            const { error } = productJoiSchema.validate(req.body);

            if(error){
                if(req.file){
                    fs.unlink(`${appRoot}/${newFilePath}`, (err) => {
                        if(err){
                            return next(CustomeErrorHandler.multerError("error from update image"))
                        }
                    });
                    return next(error);
                }
            }
             
            const { name, price, category, description } = req.body;

            let newDocument;

            try{
                newDocument = await productModel.findByIdAndUpdate({ _id: req.params.id }, { //params is what we are getting in the route / example: for this route we will get :id
                    name,
                    price,
                    category,
                    description,
                    ...(req.file && { image: newFilePath })
                }, {new: true});

                console.log("Updated file is: ",newDocument);
            }catch(err){
                if(err) {
                    fs.unlink(`${appRoot}/${newFilePath}`, (err) => {
                        
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message)); //this will return the error, incase file can to be deleted
                        }
                    }); //approot is global variable, to use global variable inside the express, then we have to define it inside the server.js file
                    
                    return next(err); //this will return the joi error
                }

                fs.unlink(`${appRoot}/${newFilePath}`, (err) => {
                        
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message)); //this will return the error, incase file can to be deleted
                    }
                })
                
                return next(err);
            }

            res.status(202).json(newDocument);
        })
    }
}

export default updateController;
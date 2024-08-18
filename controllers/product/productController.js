import Joi from "joi";
import productModelSchema from "../../models/productModel/productModelSchema";

const productController = {

    async addProduct(req, res, next) {
        imageData(req, res, async (err) => {
            if (err) {
                return next(CustomeErrorHandler.multerError(err.message));
            }
            console.log(req.file);
            const filePath = req.file.path;

            //const { error } = productJoiSchema.validate(req.body);

            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                category: Joi.string().required(),
                description: Joi.string().required(),
                image: Joi.string()
            })

            const { error } = productSchema.validate(req.body);

            if (error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => { //appRoot is global variable. 
                    if (err) {
                        return next(CustomeErrorHandler.multerError(err.message))
                    }
                });
                return next(error);
            }

            const { name, price, category, description } = req.body;
            let document;

            try {
                document = await productModelSchema.create({
                    name: name,
                    price: price,
                    category: category,
                    description: description,
                    image: filePath
                });
            } catch (err) {
                return next(err);
            }

            res.status(200).json(document);

        });
    }

    ,

    async uploadProduct(req, res, next) {
        try {
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                category: Joi.string().required(),
                description: Joi.string().required(),
                image: Joi.array()
            })
            const { error } = productSchema.validate(req.body);
            if (error) {
                return next(error);
            }
            let productToBeUploaded;
            try {
                productToBeUploaded = await productModelSchema.create({
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category,
                    description: req.body.description,
                    image: req.body.image
                })
            } catch (err) {
                return next(err);
            }
            // console.log(productToBeUploaded);
            res.status(200).json(productToBeUploaded);
        } catch (err) {
            return next("Upload product is failed", err);
        }
    }
}

export default productController;
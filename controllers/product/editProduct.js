import { productModel } from "../../models";
import productJoiSchema from "../../validator/productValidate";

const editProduct = {

    async updateProduct(req, res, next) {
        let productDoc;
        // console.log(req.body)

        const { error } = productJoiSchema.validate(req.body);
        if (error) {
            // console.log(error)
            return next("Joi validation has failed", error)
        }

        // const { name, price, category, description, image } = req.body;

        try {
            productDoc = await productModel.findByIdAndUpdate({ _id: req.params.id }, {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category,
                    description: req.body.description,
                    image: req.body.image,                
            }, { new: true });
            // res.status(200).json(productDoc);

            console.log("Updated product is: ", productDoc);
        } catch (err) {
            return next("Error from catch block",err)
        }

        res.status(200).json(productDoc);
    }
}

export default editProduct;
import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { productModel } from "../../models";

const getAllProduct = {
  async getAll(req, res, next) {
    let document;

    try {
      document = await productModel
        .find()
        .select("-password")
        .sort({ price: 1 });
    } catch (err) {
      return next(
        CustomeErrorHandler.serverError(
          "Can not get the all product deu to the server error"
        )
      );
    }
    return res.json(document);
  },

  async getBanner(req, res, next) {
    try {
      const document = await productModel.find().select("image").select("category");
    //   console.log(document)

      function extractImages(data) {
        return data.reduce((acc, item) => {
        //   return acc.concat(item.image);
        if (item.category === "banner") {
            return acc.concat(item.image);
          }
          return acc;
        }, []);
      }
      const allImages = extractImages(document);
      return res.json({banner: allImages});

    } catch (err) {
      return res.json(
        CustomeErrorHandler.serverError(
          "Error from the get all data, banner catch section"
        )
      );
    }
   
  },
};

export default getAllProduct;

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

  //home page banner image conditions

  async getBanner(req, res, next) {
    try {
      const document = await productModel.find().select("image").select("category").select("name").select("description");
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

      function extractName(data){
        return data.reduce((acc, item) => {
          if(item.category === "banner"){
            return acc.concat(item.name);
          }
          return acc;
        }, [])
      }

      function extractDescription(data){
        return data.reduce((acc, item) => {
          if(item.category === "banner"){
            return acc.concat(item.description)
          }
          return acc;
        }, [])
      }

      const allImages = extractImages(document);
      const allNames = extractName(document);
      const allDesc = extractDescription(document);
      return res.json({ image:allImages, name:allNames, description:allDesc  });

    } catch (err) {
      return res.json(
        CustomeErrorHandler.serverError(
          "Error from the get all data, banner catch section"
        )
      );
    }
  },


  //home page new arrivals function
  async getNewArrivals(req, res, next){
    try{
      const document = await productModel.find().select("image").select("category").select("name")

      function extractImage(data){
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "newArrival") {
              return acc.concat(item.image[0]);
            }
            return acc;
          }, []);
      }

      function extractName(data){
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "newArrival") {
              return acc.concat(item.name);
            }
            return acc;
          }, []);
      }

      const allImage = extractImage(document);
      const allName = extractName(document);

      return res.json({ image: allImage, name: allName })

    }catch(err){
      return res.json(CustomeErrorHandler.serverError("Error from new arrivals catch block"))
    }
  }


};

export default getAllProduct;

import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { productModel } from "../../models";

const getAllProduct = {
  async getAll(req, res, next) {
    let document;

    try {

      const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
      const limit = parseInt(req.query.limit) || 6; // default to 10 items per page

      // Calculate the starting index of the items for the current page
      const startIndex = (page - 1) * limit;

      document = await productModel
        .find()
        .select("-password")
        .sort({ price: 1 })
        .skip(startIndex)
        .limit(limit)
        .exec();

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
      const document = await productModel
        .find()
        .select("image")
        .select("category")
        .select("name")
        .select("description");
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

      function extractName(data) {
        return data.reduce((acc, item) => {
          if (item.category === "banner") {
            return acc.concat(item.name);
          }
          return acc;
        }, []);
      }

      function extractDescription(data) {
        return data.reduce((acc, item) => {
          if (item.category === "banner") {
            return acc.concat(item.description);
          }
          return acc;
        }, []);
      }

      const allImages = extractImages(document);
      const allNames = extractName(document);
      const allDesc = extractDescription(document);
      return res.json({
        image: allImages,
        name: allNames,
        description: allDesc,
      });
    } catch (err) {
      return res.json(
        CustomeErrorHandler.serverError(
          "Error from the get all data, banner catch section"
        )
      );
    }
  },

  //home page new arrivals function
  async getNewArrivals(req, res, next) {
    try {
      const document = await productModel
        .find()
        .select("image")
        .select("category")
        .select("name");

      function extractImage(data) {
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "newArrival") {
            return acc.concat(item.image[0]);
          }
          return acc;
        }, []);
      }

      function extractName(data) {
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

      return res.json({ image: allImage, name: allName });
    } catch (err) {
      return res.json(
        CustomeErrorHandler.serverError("Error from new arrivals catch block")
      );
    }
  },

  async getAccessories(req, res, next) {
    try {
      const document = await productModel
        .find()
        .select("image")
        .select("category")
        .select("name")
        .select("price");

      function extractImages(data) {
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "accessories") {
            return acc.concat(item.image);
          }
          return acc;
        }, []);
      }

      function extractName(data) {
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "accessories") {
            return acc.concat(item.name);
          }
          return acc;
        }, []);
      }

      function extractPrice(data) {
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "accessories") {
            return acc.concat(item.price);
          }
          return acc;
        }, []);
      }

      const allImages = extractImages(document);
      const allNames = extractName(document);
      const allPrice = extractPrice(document);

      return res.json({ image: allImages, name: allNames, price: allPrice });
    } catch (err) {
      return res.json(
        CustomeErrorHandler.serverError("Error from getAccessories catch block")
      );
    }
  },

  async getMods(req, res, next){
    try{
      const document = await productModel.find().select("image").select("category").select("name").select("price");

      function extractName(data){
        return data.reduce((acc, item) => {
          if(item.category === "mods"){
            return acc.concat(item.name);
          }
          return acc;
        }, [])
      }

      function extractPrice(data){
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "mods") {
            return acc.concat(item.price);
          }
          return acc;
        }, []);
      }

      function extractImage(data){
        return data.reduce((acc, item) => {
          //   return acc.concat(item.image);
          if (item.category === "mods") {
            return acc.concat(item.image);
          }
          return acc;
        }, []);
      }

      const allNames = extractName(document);
      const allPrice = extractPrice(document);
      const allImages = extractImage(document);
      
      return res.json({ image: allImages, name: allNames, price: allPrice });

    }catch(err){
      return res.json(CustomeErrorHandler.serverError("Error from the get mods catch block", err))
    }
  },

  async getProductByCategory(req, res, next){
    let accessories;
    let streetFighter;
    let mods;
    let newArrival;
    let city;
    let tourer;
    let essentials;
    try{
      accessories = await productModel.find({ category: "accessories" })
      streetFighter = await productModel.find({ category: "streetFighter" })
      mods = await productModel.find({ category: "mods" })
      newArrival = await productModel.find({ category: "newArrival" })
      city = await productModel.find({ category: "city" })
      tourer = await productModel.find({ category: "tourer" })
      essentials = await productModel.find({ category: "essentials" })
    }catch(err){
      return res.json(CustomeErrorHandler.serverError("Error from catch block of get product by category",err))
    }

    try{
      
    }catch(err){
      return res.json(CustomeErrorHandler.serverError("Error in sending response from get product by categories"))
    }

    return res.json({ accessories: accessories, streetFighter: streetFighter, mods: mods, newArrival: newArrival, city: city, tourer: tourer, essentials: essentials });
  },



};

export default getAllProduct;

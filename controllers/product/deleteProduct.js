// import { STATUS_CODES } from "http";
// import CustomeErrorHandler from "../../customError/CustomErrorHandler";
// import { productModel } from "../../models";
// import fs from 'fs';

// const deleteProduct = {
//     async destroy(req, res, next) {
//         try{
//             const document = await productModel.findOneAndRemove({ _id: req.params.id });
//             if(!document){
//                 return next(new Error("Nothing is there to be deleted"));
//             }
    
//             const imagePath = document.image;
//             fs.unlink(`${appRoot}/${imagePath}`, (err) => {
//                 if(err){
//                     return next(CustomeErrorHandler.serverError("Error from delete product model"));
//                 }
//             })
//         }catch(err){
//             return next(CustomeErrorHandler.deleteNotPossible())
//         }
//         res.status(200);
//     }
// }

// export default deleteProduct;

import { productModel } from "../../models";
import fs from "fs";
import path from "path";
import CustomeErrorHandler from "../../customError/CustomErrorHandler";

const deleteProduct = {
  async destroy(req, res, next) {
    try {
      const document = await productModel.findOneAndRemove({
        _id: req.params.id,
      });
      if (!document) {
        return next(new Error("Nothing is there to be deleted"));
      }

      const imagePath = document.image;
      const fullPath = path.resolve() + "/" + imagePath;
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Image deletion failed:", err.message);
        }
      });

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return next(CustomeErrorHandler.deleteNotPossible());
    }
  },
};

export default deleteProduct;

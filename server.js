import express from 'express';

const app = express();

import {APP_KEY, ECOMDB} from './config';

import router from './routes';

import errorHandler from './middleware/errorHandler';
import mongoose from 'mongoose';
import CustomeErrorHandler from './customError/CustomErrorHandler';
import path from 'path';
import cors from "cors";



global.appRoot = path.resolve(__dirname); //appRoot is used in product->productController.js->line number 33

app.use(express.urlencoded({ extended: false })) //to accecpt multipart form data, we use this line

app.use(cors());

app.use(express.json()); //to accecpt json form data, we use this line

app.use('/ecom',router);

app.use(errorHandler);



app.listen(APP_KEY, () => console.log(`listening on port ${APP_KEY}`));

mongoose.connect(ECOMDB).then(() => console.log("DB Connected! now get lost")).catch((err) => {
    CustomeErrorHandler.DbError("you can not connect database with backend, please die in peace!")
})
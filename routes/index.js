import express from 'express';
const router = express.Router();
import { deleteProduct, getAllProduct, getOneProduct, loginController, productController, refreshController, registerController, updateController } from '../controllers';
import userController from '../controllers/auth/userController';
import userAuth from '../middleware/userAuth';
import admin from '../middleware/admin';

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/getUser', userAuth, userController.getUser);

router.post('/getAccessToken', refreshController.refreshMethod);

router.post('/logout', userAuth, loginController.logout);

//product section

router.post('/product/add', [userAuth, admin], productController.addProduct);

router.put('/product/update/:id', [userAuth, admin] , updateController.updateProduct);

router.delete('/product/delete/:id', [userAuth, admin] ,deleteProduct.destroy);

router.get('/product/getAll', [userAuth, admin], getAllProduct.getAll);

router.get('/product/getOne/:id', [userAuth, admin], getOneProduct.getOne);

export default router;
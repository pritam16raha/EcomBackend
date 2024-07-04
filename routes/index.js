import express from 'express';
const router = express.Router();
import { deleteProduct, getAllProduct, getOneProduct, loginController, productController, refreshController, registerController, updateController } from '../controllers';
import userController from '../controllers/auth/userController';
import userAuth from '../middleware/userAuth';
import admin from '../middleware/admin';

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/getuser', userAuth, userController.getUser);

router.get('/getalluser', [userAuth, admin],  userController.getAllUser);

router.delete('/deleteuser/:id', [userAuth, admin], userController.deleteUser);

router.put('/updateuser/:id', [userAuth, admin], userController.updateUser);

router.post('/getAccessToken', refreshController.refreshMethod);

router.post('/logout', userAuth, loginController.logout);

router.get('/getuserinfo/:id', [userAuth, admin] , userController.getuserinfo);

//product section

// router.post('/product/add', [userAuth, admin], productController.addProduct);
router.post('/product/upload', [userAuth, admin], productController.uploadProduct);

router.put('/product/update/:id', [userAuth, admin] , updateController.updateProduct);

router.delete('/product/delete/:id', [userAuth, admin] ,deleteProduct.destroy);

router.get('/product/getAll', [userAuth, admin], getAllProduct.getAll);

router.get('/product/getOne/:id', [userAuth, admin], getOneProduct.getOne);

// //trail route
// router.get('/product/getAll', [userAuth, admin], getAllProduct.getAll)

export default router;
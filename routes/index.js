import express from 'express';
const router = express.Router();
import { deleteProduct, getAllProduct, getOneProduct, loginController, ordered, productController, refreshController, registerController, updateController } from '../controllers';
import userController from '../controllers/auth/userController';
import userAuth from '../middleware/userAuth';
import admin from '../middleware/admin';
import editProduct from '../controllers/product/editProduct';
import { productModel } from '../models';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SK)


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

router.put('/product/edit/:id', [userAuth, admin] , editProduct.updateProduct);

router.delete('/product/delete/:id', [userAuth, admin] ,deleteProduct.destroy);

router.get('/product/getAll', [userAuth], getAllProduct.getAll);

router.get('/getAll', getAllProduct.getAll);

router.get('/product/getOne/:id', [userAuth], getOneProduct.getOne);

router.get('/product/banner',  getAllProduct.getBanner);

router.get('/product/newarrival',  getAllProduct.getNewArrivals);

router.get('/product/accessories',  getAllProduct.getAccessories);

router.get('/product/mod',  getAllProduct.getMods);

router.get('/product/productbycategory',  getAllProduct.getProductByCategory);


//token get
router.get("")
//order post routes
router.post('/orderplace', userAuth, ordered.order);

router.get('/getorder', userAuth, ordered.getPlacedOrder);

router.get('/getallorder', userAuth, ordered.getAllOrder);

router.post('/getorderbyuser', userAuth, ordered.getOrderByUser);
//for payment
router.post("/order/:id", userAuth, async(req, res) => {
    //1. total cost 2. product id: [] 3. userid
    const { productQuantity } = req.body;
    const productId = req.params.id;
    const product = await productModel.findById(productId);

    if(!product){
        return res.status(400).json({ message: "Product not found" })
    }

    const totalCost = productModel.price * productQuantity;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost*100,
        currency: "inr",
        metadata: {
            productId,
            userId: req.userId
        }
    })

    if (!paymentIntent.client_secret) {
        return res.status(500).json({ message: "Error creating payment intent" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.json(),
        totalCost,
      };

      res.send(response)
} )

export default router;
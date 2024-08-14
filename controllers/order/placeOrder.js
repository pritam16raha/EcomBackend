import CustomeErrorHandler from "../../customError/CustomErrorHandler";
import { orderModel } from "../../models";
import { UserModel } from "../../models";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SK)

const placeOrder = {
    async order(req, res, next){
        try{
            const newOrder = new orderModel({
                userId: req.body.id,
                username: req.body.currentUser.username,
                items: req.body.cart,
                amount: req.body.cartTotal,
                status: "Payment Done",
                payment:true
            }) 
            await newOrder.save();
            // await UserModel.findByIdAndUpdate(req.body._id, {cartData: {}})

            const line_items = req.body.cart.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price*100
                },
                quantity: 1
            }))

            // line_items.push({
            //     price_data:{
            //         currency: "inr",
            //         product_data:{
            //             name: "Delivery Charges"
            //         },
            //         unit_amount: 2*100*80
            //     },
            //     quantity: 1
            // })

            const session = await stripe.checkout.sessions.create({
                payment_method_types:["card"],
                line_items: line_items,
                mode: 'payment',
                success_url: "https://ecom-frontend-eight-tau.vercel.app",
                
                // cancel_url: ""
            })
            res.json({ success: true, session_url: session.url })

        }catch(err){
            console.log("Error from place order order function catch block", err);
            res.json({ seccess: false, message: "error" })
        }
    },

    async getPlacedOrder(req, res, next){
        try{
            const orders = await orderModel.findById( req.body.id );
            const user = await UserModel.findById(orders.userId);
            // res.json({user})
            res.json({orders, user})
            //res.json({user})
            console.log({user})
        }catch(err){
            return next(CustomeErrorHandler.failedOrder("Order details can not be fetched"))
        }
    },

    async getAllOrder (req, res, next){
        let getOrder;
        try{
            getOrder = await orderModel.find()
            return res.json(getOrder);
        }catch(err){
            return next(CustomeErrorHandler.failedOrder("Order details can not be fetched"))
        }
    },

    async getOrderByUser(req, res, next){
        try{
            const getAllOrder = await orderModel.find({  userId: req.body.id });
            res.json({ orders: getAllOrder })
        }catch(err){
            return next(CustomeErrorHandler.userNotFound("Can not find the order of the selected user", err))
        }
    },

    async deleteOrder(req, res, next){

    },

    async updateOrder(req, res, next){
        
    }
}

export default placeOrder;
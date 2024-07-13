import { orderModel } from "../../models";
import { UserModel } from "../../models";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK)

const placeOrder = {
    async order(req, res, next){
        try{
            const newOrder = new orderModel({
                userId: req.body.id,
                items: req.body.items,
                amount: req.body.cartTotal,
            }) 
            await newOrder.save();
            // await UserModel.findByIdAndUpdate(req.body._id, {cartData: {}})

            const line_items = req.body.cart.map((item) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price*100*80
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
                success_url: "https://www.pritamraha.in",
                // cancel_url: ""
            })

            res.json({ success: true, session_url: session.url })
        }catch(err){
            console.log("Error from place order order function catch block", err);
            res.json({ seccess: false, message: "error" })
        }
    }
}

export default placeOrder;
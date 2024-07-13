import orderModelSchema from "../../models/orderModel/orderModelSchema";

var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const braintreeController = {
    async getToken(req, res, next) {
        try {
            gateway.clientToken.generate({}, function (err, response) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(response);
                }
            })
        } catch (err) {
            return next("Error from braintree getToken catch block", err);
        }
    },

    async paymentDone(req, res, next) {
        try {
            const { cart, nonce } = req.body;
            let total = 0;
            cart.map((i) => {
                total += i.price;
            });

            let newTransaction = gateway.transaction.sale({
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true
                }
            },
            function(error, result){
                if(error){
                    const order = orderModelSchema({
                        products: cart,
                        payment: result,
                        buyer: req.userInDB._id
                    }).save();
                    res.json({ ok: true })
                }else{
                    res.status(500).send(error);
                }
            }
        )
        } catch (err) {
            return next("Error from braintree paymentDone catch block", err);
        }
    }
}

export default braintreeController;
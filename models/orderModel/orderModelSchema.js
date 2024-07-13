import mongoose from "mongoose";

const orderModelSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "Processing" },
    payment: { type: Boolean, default: false },
    date: {type: Date, default: Date.now()}

}, {timestamps: true})

export default mongoose.model('Order', orderModelSchema, 'Orders');
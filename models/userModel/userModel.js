import { required } from "joi";
import mongoose from "mongoose";

const MySchema = mongoose.Schema;


const userSchema = new MySchema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true });


export default mongoose.model('User', userSchema , 'UserProfileData');

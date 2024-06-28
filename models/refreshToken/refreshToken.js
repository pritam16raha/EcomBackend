import mongoose from 'mongoose';

const refreshSchema = mongoose.Schema;

const refreshTokenModelSchema = new refreshSchema({
    Ref_Token: {type: String, unique: true}
}, {timestamps: true})

export default mongoose.model('RefreshToken', refreshTokenModelSchema, 'Tokens');
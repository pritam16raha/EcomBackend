import Joi from 'joi';

const productJoiSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.array()
});

export default productJoiSchema;
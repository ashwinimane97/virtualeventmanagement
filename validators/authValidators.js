const Joi = require('joi');

const validateUserRegistration = (data) => {

    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        preferences: Joi.array().items(Joi.string().valid("technology", "sports", "business", "entertainment", "movies", "comics")).default([])
    });
    return schema.validate(data);
}


const validateUserLogin = (data) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports = {
    validateUserRegistration,
    validateUserLogin
}
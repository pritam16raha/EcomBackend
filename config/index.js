 import dotenv from 'dotenv';
 dotenv.config();

 export const {
    APP_KEY,
    DEBUG_MODE,
    LOCALDB,
    MONGODB,
    ECOMDB,
    JWTSECRET,
    REFRESHKEY,
    ADMIN
 } = process.env;
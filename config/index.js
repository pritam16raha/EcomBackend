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
   ADMIN,
   MERCHENT_ID,
   PUBLIC_KEY,
   PRIVATE_KEY,
   STRIPE_PRIVATE_KEY
} = process.env;
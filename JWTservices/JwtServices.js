import { JWTSECRET } from "../config";
import jwt from 'jsonwebtoken';

class JwtServices {
    static sign(payload, expiry='365d', secret=JWTSECRET){
        return jwt.sign(payload, secret, {expiresIn: expiry})
    }

    static verify(accessToken, secret= JWTSECRET ){
        return jwt.verify(accessToken, secret);
    }
}

export default JwtServices;
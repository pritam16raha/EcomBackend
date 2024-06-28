class CustomeErrorHandler extends Error {
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;        
    }

    static alreadyExist(message){
        return new CustomeErrorHandler(409, message);
    }

    static DbError(message){
        return new CustomeErrorHandler(502, message);
    }

    static UserDataNotSaved(message){
        return new CustomeErrorHandler(503, message);
    }

    static WrongEmail(message){
        return new CustomeErrorHandler(504, message);
    }

    static WrongPassword(message){
        return new CustomeErrorHandler(505, message);
    }

    static unauthorisedToken(message="token might be unauthorised"){
        return new CustomeErrorHandler(506, message);
    }

    static userNotFound(message){
        return new CustomeErrorHandler(507, message);
    }

    static voidToken(message){
        return new CustomeErrorHandler(508, message);
    }

    static fakeUser(message){
        return new CustomeErrorHandler(509, message);
    }

    static multerError(message = "multer error or server error"){
        return new CustomeErrorHandler(510, message);
    }

    static serverError(message = "server error"){
        return new CustomeErrorHandler(511, message)
    }
}

export default CustomeErrorHandler;
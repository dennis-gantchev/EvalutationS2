import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

const AuthMiddleware = {
    verifToken: (req,res,next) => {
        const token = req.session.token
        
        
        const tokenDecode = jwt.decode(token,process.env.jwtSecret)

        if(tokenDecode){
            req.session.idUser = tokenDecode.id.toString()
            return next()
        }
        
        return res.redirect('/user/login')
        
    
    }
}

export default AuthMiddleware
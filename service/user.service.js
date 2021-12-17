import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import User from "../model/user.model"

dotenv.config()
const UserService = {
    validate : (validation,password,passwordConfirm) => {
        const error = {
            firstName: false,
            lastName: false,
            email: false,
            password: false,
            passwordConfirm: false,
            hasError: false
        }
        if(validation.errors){
            validation.errors.map((item) => {
                error[item.param] = true
                if(!error.hasError){
                    error.hasError = true
                } 
                
            })
        }
        error.passwordConfirm = password !== passwordConfirm
        if(error.passwordConfirm){
            if(!error.hasError){
                error.hasError = true
            }
        }

        return error
    },
    create: (firstName, lastName, email, password) => {
        console.log(process.env.secret)
        const salt = bcrypt.genSaltSync(Number(process.env.secret))
        
        const hash = bcrypt.hashSync(password,salt)

        const user = new User({
            firstName,
            lastName,
            email,
            password: hash
        })


        return user
    }

}


export default UserService
import { validationResult } from "express-validator"
import User from "../model/user.model";
import UserService from "../service/user.service";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()



const UserController = {
    new: (req,res) => {
        res.render('user/new',{error:false,isConnected: req.session.idUser})
    },
    create: async (req,res) => {
        const { firstName, lastName, email, password, passwordConfirm} = req.body
        const validation = validationResult(req);
        const error = UserService.validate(validation, password, passwordConfirm)
        
        if(error.hasError){
            res.render('user/new',{error:error,isConnected: req.session.idUser })
        }

        const user = UserService.create(firstName, lastName, email, password)
        try{
            await user.save()

            res.redirect('/user/login')
        }catch(MongoServerError){
            error.emailExist = true
            res.render('user/new', {error:error,isConnected: req.session.idUser })
        }
        
    },
    login: (req,res) => {
        res.render('user/login',{error:false,isConnected: req.session.idUser})
    },
    connection: async (req,res) => {
        const { email, password } = req.body
        const error = {
            email: false,
            password: false
        }
        const user = await User.findOne({email})
        
        if(!user){
            error.email = true

            return res.render('user/login', {error,isConnected: req.session.idUser })
        }
        error.password = !bcrypt.compareSync(password,user.password)
        
        if(error.password){
            return res.render('user/login',{error,isConnected: req.session.idUser})
        }

        const token = jwt.sign({id:user.id},process.env.jwtSecret, { expiresIn: '1h' })

        req.session.token = token
        
        return res.redirect('/content/dashboard')
    
    },
    logout: (req, res) => {
        console.log(req.session.idUser)
        req.session.idUser = false
        req.session.token = false

        res.redirect('/user/login')
    }
}


export default UserController
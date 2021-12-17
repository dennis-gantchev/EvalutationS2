import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import session from 'express-session'
import userRouter from './route/user.route';
import AuthMiddleware from './middleware/auth.middleware';


dotenv.config()


const app = express();
mongoose.connect(`mongodb://localhost:27017/eval`)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(session({secret: "Shh, its a secret!"}));

app.set('view engine', 'ejs')

app.use('/user',userRouter)

app.get('/',(req,res) => {
    if(!req.session.idUser){
        req.session.idUser = false
    }
    res.render('user/login',{error:false, isConnected: req.session.idUser })
})

app.get('/content/dashboard',AuthMiddleware.verifToken,(req,res) => {
    res.render("content/dashboard",{isConnected: req.session.idUser })
})


app.listen(process.env.port,() => {
    console.log(`server start on http://${process.env.host}:${process.env.port}`)
})
import { Router } from "express";
import { check, validationResult } from "express-validator"
import UserController from "../controller/user.controller";

const userRouter = Router()

userRouter.get('/new',UserController.new)
userRouter.post('/create',
    check('firstName','The first name must contain more than 3 non-numeric characters.')
    .isAlpha()
    .isLength({min:3}),
    check('lastName', 'The first name must contain more than 3 non-numeric characters.')
    .isAlpha()
    .isLength({min:3}),
    check('email','The email format is incorrect.')
    .isEmail(),
    check('password').isLength({min:8, max:20})
, UserController.create)
userRouter.get('/login',UserController.login)
userRouter.post('/connection',UserController.connection)
userRouter.get('/logout',UserController.logout)

export default userRouter
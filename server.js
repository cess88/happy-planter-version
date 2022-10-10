import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import plantesRouter from "./router/plantesRouter.js";
import usersRouter from "./router/usersRouter.js";
import cors from 'cors'
import session from "express-session";

const db = process.env.BDD_URL
const app = express()
const router = express.Router()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets'));
app.use(express.json())
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.use(router)
router.use(usersRouter)
router.use(plantesRouter)


app.listen(process.env.PORT,(error)=> {
    if (error) {
      console.log("error");  
    }else{
        console.log(`Connected at ${process.env.APP_URL}`);
    }
})
mongoose.connect(db, function(error){
    if (error) {
        console.log("error");  
      }else{
          console.log("connected to database mongodb (HAPPY PLANTER Notre projet fin d'étude !!!)");
      }
})

export default router

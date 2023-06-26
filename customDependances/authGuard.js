import usersModels from "../models/usersModels.js";

let authGuard = async (req, res, next) =>{
    let user = await usersModels.findOne({_id: req.session.user})
    if (user) {
        next()
    }else{
        res.redirect("/connexion")
    }
}

let adminGuard = async (req, res, next) =>{
    let user = await usersModels.findOne({_id: req.session.user})
    if (user) {
        if (user.role =="admin" ) {
            next()
        }else{
            res.redirect("/connexion")
        }
    }else{
        res.redirect("/connexion")
    }
}

export  {authGuard}
export {adminGuard}
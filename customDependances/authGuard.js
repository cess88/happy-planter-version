import usersModels from "../models/usersModels.js";

let authGuard = async (req, res, next) =>{
    let user = await usersModels.findOne({_id: req.session.user})
    if (user) {
        next()
    }else{
        res.redirect("/login")
    }
}

export default authGuard
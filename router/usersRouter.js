import { Router } from "express"
import usersModels from "../models/usersModels.js"
import { comparePassword, cryptPassword } from "../customDependances/cryptPassword.js"

const usersRouter = Router()


/***********renvoi a l'accueil***********/

usersRouter.get('/home',async (req, res)=>{
    try{
      res.render('pages/home.twig',{
        title: "HAPPY PLANTER"
      })
    }catch (error){
        res.send(error)
    }
})

/***********Ajout d'un utilisateur avec protection password***********/

usersRouter.get('/subscribe',async (req, res)=>{
    try{
      res.render('pages/subscribe.twig', {
        title: "HAPPY PLANTER"
      })
    }catch (error){
        console.log(error);
        res.send(error)
    }
})

usersRouter.post('/subscribe', async (req, res) => {
    try {
      let userByMail = await usersModels.findOne({mail: req.body.mail})
      if (!userByMail) {                                               //*et avec le "if/else" message d'erreur sur html****//
        req.body.password = await cryptPassword(req.body.password)
        let user = new usersModels(req.body)
        await user.save()
        req.session.user = user._id
        res.redirect('/directory')
      }else{
        throw "Ce mail est deja utilisé";
      }
       
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
  })

  usersRouter.get('/connexion',async (req, res)=>{
    try{
      res.render('pages/connexion.twig',{
        title: "HAPPY PLANTER"
      })
    }catch (error){
        console.log(error);
        res.send(error)
    }
})

    
usersRouter.post('/connexion', async (req, res) => {
    try {
     let user = await usersModels.findOne({mail: req.body.mail})
     if (user) {
        let isgoodpswd = await comparePassword(req.body.password, user.password)
        if (isgoodpswd) {
            req.session.user = user
            res.redirect('collectible')
        }else{
            throw "Mauvais password !"
        }
     }else{
        throw "Pas de compte crée! Allez sur le formulaire d'inscription!!"
     }
    } catch (error) {
        console.log(error);
        res.send(error);
    }
  })

  usersRouter.get('/logout' , async (req, res) => {
    try{
    
       req.session.destroy()
       res.redirect('connexion')
    }catch(err){
        res.send(err)
    }
})


usersRouter.get('/params' , async (req, res) => {
  try{
     res.render('./pages/params.twig')
  }catch(err){
      res.send(err)
  }
})



export default usersRouter
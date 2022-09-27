import { Router } from "express"
import usersModels from "../models/usersModels.js"
import { cryptPassword } from "../customDependances/cryptPassword.js"

const usersRouter = Router()


/***********renvoi a l'accueil***********/

usersRouter.get('/home',async (req, res)=>{
    try{
      res.render('pages/home.twig')
    }catch (error){
        res.send(error)
    }
})



/***********Ajout d'un utilisateur avec protection password***********/

usersRouter.get('/addUser',async (req, res)=>{
    try{
      res.render('pages/subscribe.twig')
    }catch (error){
        console.log(error);
        res.send(error)
    }
})

usersRouter.post('/addUser', async (req, res) => {
    try {
      let userByMail = await usersModels.findOne({mail: req.body.mail})
      if (!userByMail) {                                               
        req.body.password = await cryptPassword(req.body.password)
        let user = new usersModels(req.body)
        await user.save()
        res.redirect('directory')
      }else{
        throw "Ce mail est deja utilisé";
      }
       
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
  })

  //**************recup d utilisateurs***********/




usersRouter.get('/users',async (req, res)=>{
    try{
       
        let users = await usersModels.find({},{__v:0, password: 0})
        res.render('collection.twig')
    }catch (error){
        console.log(error);
        res.send(error)
    }
})



//***************recup d'un utilisateur avec id ou mail*******/

usersRouter.get('/connexion',async (req, res)=>{
    try{
      res.render('pages/connexion.twig')
    }catch (error){
        console.log(error);
        res.send(error)
    }
})

usersRouter.get('/user/findById/:id', async (req, res) => {
    try{
        let user = await usersModels.findOne({_id: req.params.id});
        res.render('connexion.twig')
    }catch(err) {
        res.send(err)
    }
})

usersRouter.get('/user/findBy/:mail', async (req, res) => {
    try{
        let user = await usersModels.findOne({_mail: req.params.mail});
        res.render('connexion.twig')
    }catch(err) {
        res.send(err)
    }
})

  //**************modifs d'un utilisateur***********/

  usersRouter.put('/user/:id', async(req, res)  => {
    try{
        let user = await usersModels.updateOne({_id: req.params.id})
        res.render('subscribe.twig')
    }catch(err){
        res.send(err)
    }
  })

    //**************suppression d'un utilisateur***********/

    usersRouter.delete('/user/:id' , async (req, res) => {
        try{
        let user = await usersModels.deleteOne({_id: req.params.id})
        res.render('subscribe.twig')
        }catch(err){
            res.send(err)
        }
    })
    
export default usersRouter
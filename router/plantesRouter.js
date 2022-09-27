import { json, Router } from "express"
import plantesModels from "../models/plantesModels.js"
import multer from 'multer'
const plantesRouter = Router()


//*******multer for images*******/


const storage = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null,'./assets/images/plantes' )
  },
  filename:function (req,file,callback) {
    callback(null,Date.now() + file.originalname)
  },
})

const upload = multer({
  storage:storage,
  limits:{
    fieldSize:102410243,
  },
})
/*********directory****** */

plantesRouter.get('/directory', async (req, res) => {
  try {
      let plantes = await plantesModels.find();
      res.render('pages/directory.twig', {
          plantes: plantes,
      })
  } catch (error) {
      console.log(error);
  }
})

/*********cardDirectory admin****** */


plantesRouter.get('/cardDirectory',async (req, res)=>{
    try{
      res.render('pages/cardDirectory.twig',{
        
      })
    }catch (error){
        console.log(err);
    }
})

plantesRouter.post('/plantes',upload.single('image'), async ( req, res)=>{
    try{
        req.body.image = req.file.filename
        const newPlante = new plantesModels(req.body) 
        newPlante.save()
        res.redirect('/plantes')
    }catch (error){

    }
})

/***********envoi au repertoire***********/

plantesRouter.post('/home',async (req, res)=>{
  try{
      let plantByName = await plantesModels.findOnePlanter({_id: req.name.id})
      if (plantByName) {
        req.session.plantes = plante._id
        res.redirect('/directory')
      }else{
        res.redirect('message')
      }
  }catch (error){
      res.send(error)
  }
})


export default plantesRouter
import { json, Router } from "express"
import { get } from "http";
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
      let interiorPlants = await plantesModels.find({planteType:'interieur'});
      let exteriorPlants = await plantesModels.find({planteType:'exterieur'});

      res.render('pages/directory.twig', {
        interiorPlants: interiorPlants,
        exteriorPlants: exteriorPlants,
        title: "REPERTOIRE"
      })
  } catch (error) {
      console.log(error);
  }
})

/*********cardDirectory****** */


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

//******cardPlante****** */

plantesRouter.get('/cardPlante/:plantId', async (req, res) => {
  try {
      let plant = await plantesModels.findOne({_id:req.params.plantId});
      console.log(plant);
      res.render('pages/cardPlante.twig', {
       plant: plant
      })
  } catch (error) {
      console.log(error);
  }
})
/*********collection****** */

plantesRouter.get('/collectible', async (req, res) => {
  try {
      let interiorPlants = await plantesModels.find({planteType:'interieur'});
      let exteriorPlants = await plantesModels.find({planteType:'exterieur'});

      res.render('pages/collectible.twig', {
        interiorPlants: interiorPlants,
        exteriorPlants: exteriorPlants,
        title:"MA COLLECTION"
      })
  } catch (error) {
      console.log(error);
  }
})

export default plantesRouter
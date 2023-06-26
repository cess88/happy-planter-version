import { json, Router } from "express"
import plantesModels from "../models/plantesModels.js"
import multer from 'multer'
import { authGuard } from "../customDependances/authGuard.js";
import { adminGuard } from "../customDependances/authGuard.js";
import usersModels from "../models/usersModels.js";
import boboModels from "../models/boboModels.js";
const plantesRouter = Router()


//*******Route multer for images*******/


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './assets/images/plantes')
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname)
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 102410243,
  },
})
/********* Route directory répértoire de plantes****** */

plantesRouter.get('/directory', async (req, res) => {
  try {
    let user = req.session.user
    let error;
    let plant;
    error = req.session.error
    delete req.session.error
    let interiorPlants = await plantesModels.find({ planteType: 'interieur' });
    let exteriorPlants = await plantesModels.find({ planteType: 'exterieur' });
    if (req.query.planter) {
      plant = await plantesModels.findOne({ name: decodeURI(req.query.planter) })
      if (plant == null) {
        error = "Oups...Cette plante n'existe pas!"
      }
    }

    res.render('pages/directory.twig', {
      interiorPlants: interiorPlants,
      exteriorPlants: exteriorPlants,
      error: error,
      plant: plant,
      user: user,
      title: "REPERTOIRE"
    })


  } catch (error) {
    console.log(error);
  }
})



/********* route cardDirectory****** */


plantesRouter.get('/cardDirectory', adminGuard, async (req, res) => {
  try {
    res.render('pages/cardDirectory.twig', {

    })
  } catch (error) {
    console.log(err);
  }
})

plantesRouter.post('/plantes', adminGuard, upload.single('image'), async (req, res) => {
  try {
    req.body.image = req.file.filename
    const newPlante = new plantesModels(req.body)
    const firstBobo = new boboModels({ problem: req.body.firstbobo, solution: req.body.firstsolution })
    const secondBobo = new boboModels({ problem: req.body.secondbobo, solution: req.body.secondsolution })
    const thirdBobo = new boboModels({ problem: req.body.thirdbobo, solution: req.body.thirdsolution })
    newPlante.planteBobos = [firstBobo._id, secondBobo._id, thirdBobo._id]
    newPlante.save()
    firstBobo.save()
    secondBobo.save()
    thirdBobo.save()
    res.redirect('/collectible')
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})


plantesRouter.get('/updatePlant/:id', adminGuard, async (req, res) => {
  try {
    let plant = await plantesModels.findById(req.params.id)
    res.render('pages/cardDirectory.twig', {
      plant: plant
    })
  } catch (error) {
    console.log(err);
  }
})

plantesRouter.post('/updatePlant/:id', adminGuard, upload.single('image'), async (req, res) => {
  try {
    if (req.files) {
      req.body.image = req.file.filename

    }
    const firstBobo = new boboModels({ problem: req.body.firstbobo, solution: req.body.firstsolution })
    const secondBobo = new boboModels({ problem: req.body.secondbobo, solution: req.body.secondsolution })
    const thirdBobo = new boboModels({ problem: req.body.thirdbobo, solution: req.body.thirdsolution })
    await plantesModels.updateOne({_id: req.params.id}, req.body)
    await plantesModels.updateOne({_id: req.params.id}, {planteBobos: [firstBobo._id, secondBobo._id, thirdBobo._id]})
    firstBobo.save()
    secondBobo.save()
    thirdBobo.save()
    res.redirect('/collectible')
  } catch (error) {
    console.log(error);
    res.send(error)
  }
})


/*********route collection des plantes****** */

plantesRouter.get('/collectible', authGuard, async (req, res) => {
  try {
    let error;
    let plant;
    let user = await usersModels.findOne({ _id: req.session.user }).populate('collections')
    let collections = user.collections
    if (req.query.planter) {
      plant = collections.find((obj) => {
        if (obj.name == decodeURI(req.query.planter)) {
          return obj
        }
      })
      console.log(plant);
      if (plant == null) {
        error = "Vous n'avez pas cette plante dans votre collection !"
      }
    }
    let interiorPlants = collections.filter(function (obj) {
      if (obj.planteType == "interieur") {
        return obj;
      }
    })
    let exteriorPlants = collections.filter(function (obj) {
      if (obj.planteType == "exterieur") {
        return obj;
      }
    })
    res.render('pages/collectible.twig', {
      interiorPlants: interiorPlants,
      error: error,
      user: user,
      plant: plant,
      exteriorPlants: exteriorPlants,
      title: "MA COLLECTION"
    })
  } catch (error) {
    console.log(error);
  }
})
//*********Route d'ajout de plantes à sa collection******* */

plantesRouter.get('/addPlantToCollection/:id', authGuard, async (req, res) => {
  try {
    let user = await usersModels.findOne({ _id: req.session.user }).populate('collections')
    let arrayCollections = user.collections
    let obj = arrayCollections.find(o => o._id == req.params.id);
    if (!obj) {
      await usersModels.updateOne({ _id: req.session.user }, { $push: { collections: req.params.id } })
      res.redirect('/collectible')
    } else {
      req.session.error = 'Vous avez déja cette plante dans votre collection.'
      res.redirect('/directory')
    }
  } catch (error) {
    console.log(error);
  }
})
//******Route de suppressions de plantes de la collection******* *//

plantesRouter.get('/deletePlant/:id', authGuard, async (req, res) => {
  try {
    await usersModels.updateOne({ _id: req.session.user }, { $pull: { collections: req.params.id } })
    res.redirect('/collectible')
  } catch (error) {
    console.log(error);
  }
})

plantesRouter.get('/pharmacie/:id', async (req, res) => {
  try {
    let plant = await plantesModels.findOne({ _id: req.params.id }).populate('planteBobos')
    res.render('pages/pharmacie.twig', {
      plant: plant
    })
  } catch (error) {
    console.log(error);
  }
})



export default plantesRouter
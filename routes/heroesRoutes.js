import express from 'express'


import checkAuth from '../middlewere/authMiddleware.js'
import { deleteHeroe, editHeroe, getHeroe, getHeroes, newHeroe } from '../controllers/HeroeController.js';

const router = express.Router()

// validación de token
router.use(checkAuth)  // TODO activar con los user

// api endpoints 
router.post('/', newHeroe);
router.get('/', getHeroes);
router.get('/:id', getHeroe);
router.put('/:id', editHeroe);
router.delete('/:id', deleteHeroe);


export default router;
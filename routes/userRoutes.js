import express from 'express'
import { autenticar,  perfil, register } from '../controllers/UserController.js'
import checkAuth from '../middlewere/authMiddleware.js'

const router = express.Router()

//rutas públicas
router.post('/', register)
router.post('/login', autenticar)



// pasar por validar el token
router.use(checkAuth)


// rutas protegidas

router.get('/perfil', perfil)









export default router

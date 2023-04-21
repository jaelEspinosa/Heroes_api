
import bcrypt from 'bcryptjs'
import generarJWT from "../helpers/jwt.js"

import User from "../models/UserModel.js"




const register = async ( req, res )=>{

   const { email } = req.body 
   let user = await User.findOne({ email })

   // prevenir un usuario duplicado

   if( user ){
       return res.status(401).json({ msg: 'This user already exists'}) 
   };

  // prevenir un email no válido
   const validEmail = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

   if (!validEmail.test( email )) {
      return res.status(401).json({ msg: 'This email is not valid'})
   }


   try {

    // guardar un nuevo usuario

    user = new User( req.body ) 
    
    const userGuardado = await user.save()
    
    //enviar correo de confirmacion con el token unico
    /* await emailRegistro( userGuardado) */
   
    return res.status(200).json({ msg:'Saved user', userGuardado })
  
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:error.message})
    }
  
  
    
 }

const perfil = async ( req, res )=>{

    try {    
      return res.status(200).json( req.user )
    } catch (error) {
      console.log(error) 
      return res.status(500).json({msg: error.message})
    }

    
 } 



const confirmar = async ( req, res ) =>{

    const { token } = req.params
    const usuarioAConfirmar = await User.findOne({ token })
    
    if (!usuarioAConfirmar) {
        const error= new Error('User not found')
        return res.status(404).json({ msg: error.message})
    }

    try {
        usuarioAConfirmar.token = null;
        usuarioAConfirmar.confirmado = true;
        await usuarioAConfirmar.save()
        return res.status(200).json({msg: 'User successfully confirmed'})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'There was an error'})
    }

    
    
}
const autenticar = async (req, res) =>{

    const { email, password } = req.body
    
    try {
        // comprobar si existe el usuario 

        const user = await User.findOne({ email })
        if (!user) {
            const error= new Error('This user not exists')
            return res.status(404).json({ msg: error.message})
            }

       
        const validPassword = await bcrypt.compare( password, user.password) // aqui lo comparo directamente con bcrypt
        
        if( await user.comprobarPassword(password)){  // en este bloque if untilizo el metodo instanciado en el modelo para comprobar el pass
            console.log('password correto')
        }else{
            console.log('password incorrecto')
        }

        if(!validPassword){
            const error = new Error('Incorrect username or password')
            return res.status(401).json({msg: error.message})
        }

        const token = generarJWT(user._id, user.nombre)
        
        return res.status(200).json({ok:'true', token, nombre: user.nombre, email: user.email, _id:user._id})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg: 'There was an error'})
    }
}








 export {
    register,
    perfil,
    confirmar,
    autenticar,
    
    
 }
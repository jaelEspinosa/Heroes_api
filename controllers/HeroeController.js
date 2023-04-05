

import Heroe from '../models/HeroesModel.js';
import { URL } from 'url';


const newHeroe = async ( req, res ) => {

   const heroe = new Heroe(req.body)
   
   heroe.user = req.user._id  
   
   try {
    
     await heroe.save()
     res.status(200).json( heroe )
   } catch (error) {
     console.log(error)
     return res.status(500).json({msg:'There was an error'})
   }

};


const getHeroes = async ( req, res ) => {

  const myUrl = new URL(req.url, `http://${req.headers.host}`);
  const query = myUrl.searchParams.get('q');
  const queryLimit = myUrl.searchParams.get('_limit');


   try {
     const heroes = await Heroe.find()
     if(!heroes.length){
        return res.status(200).json({msg:"You don't have any heroes yet"})
      }
     if( query ){
        const heroesSub = heroes.filter(heroe => heroe.superhero.trim().toLowerCase().includes(query))
        if (queryLimit){
         
         const heroesLimit = heroesSub.slice(0, queryLimit)
         return res.status(200).json( heroesLimit)
        }
        return res.status(200).json( heroesSub )
     } 
     return res.status(200).json( heroes ) 
   } catch (error) {
     console.log(error)
     return res.status(500).json({msg:'There was an error'})
   }

};

const getHeroe = async ( req, res ) => {
  const { id } = req.params

  try {
    const heroe = await Heroe.findById( id )
    if (heroe === null || heroe  === undefined){
        return res.status(404).json({msg:'heroe not found'})
       }
    return res.status(200).json(heroe)   
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:'There was an error'})
  }

};
const editHeroe = async ( req, res ) => {
   const { id } = req.params
   const heroeAct = req.body
   const heroeDB = await Heroe.findById( id )

   if(!heroeDB){
     const error = new Error('Data not found')
     return res.status(404).json({msg: error.message})
     }

   if(!heroeDB.user){
    return res.status(401).json({msg:'Entrada no editable'})
   }  
   if(heroeDB.user.toString()!== req.user._id.toString()){
     return res.status(401).json({msg: 'No tienes Permisos para modificar esta entrada'})
   }  

   try {
     const heroe = await Heroe.findByIdAndUpdate( id, {heroeDB, ...heroeAct}, {new:true})
     return res.status(200).json( heroe )
    
   } catch (error) {
     console.log(error)
     return res.status(500).json({msg:'There was an error'})
   }

};
const deleteHeroe = async ( req, res ) => {
    const { id } = req.params   
  
    try {
      // validar que el user que borra sea el creador
      const heroe = await Heroe.findById( id )

      if(!heroe.user){
        return res.status(401).json({msg:'Entrada no editable'})
       }
      
      if(req.user._id.toString()=== heroe.user.toString()){
        await Heroe.findByIdAndDelete( id )  
        return res.status(200).json({msg:'Heroe Deleted'})
      }else{     
        return res.status(401).json({msg:'No tienes permisos para borrar'})
      }        
    } catch (error) {
      console.log(error)
      return res.status(500).json({msg:'There was an error'}) 
    }
};



export {
    newHeroe,
    getHeroes,
    getHeroe,
    editHeroe,
    deleteHeroe,
}
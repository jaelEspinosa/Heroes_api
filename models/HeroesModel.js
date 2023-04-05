import mongoose from 'mongoose';

const heroeSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, ref:"User"
    },
    superhero:{
        type: String,
        required:true
    },
    publisher:{
        type: String,
        required:true       
    },
    alter_ego:{
        type: String,
        required:true, 
        
    },
    first_appearance:{
        type: String,
        required: true
    },
    characters:{
        type: String,
        required:true
    },
    alt_img:{
        type: String,
        required: false
    }
    

})

const Heroe = mongoose.model('Heroe', heroeSchema )
export default Heroe

const Room = require('../models/Room');

//create room
const createRoom = async (req, res)=>{
    try{

        const room = new Room(req.body);
        await room.save();

        res.status(201).json({message:'Room created successfully '})
    } catch(err){
    res.status(500).json({message:err.message})
    }
};

//get room

 const getRooms = async(req, res)=>{
        try {
            const rooms = await Room.find();
            res.status(200).json(rooms)
        } catch (err){
            res.status(500).json({message: err.message})
        }
     }

     module.exports = {createRoom,getRooms}

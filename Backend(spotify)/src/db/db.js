const mongoose= require('mongoose');

async function connectDB() {

    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("database connected successfully");
    }
    catch(error){
        console.log("database connection error", error);
    }

}

    module.exports= connectDB;
    

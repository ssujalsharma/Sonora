const jwt= require("jsonwebtoken");


async function authArtist(req, res, next){

    let decoded;
    
        const token= req.cookies?.token || req.headers?.authorization?.replace(/^Bearer\s+/i, '');
    
        if(!token){
            return res.status(401).json({message: "Unauthorised"});
        }
    
        try{
             decoded= jwt.verify(token, process.env.JWT_SECRET);
    
            if(decoded.role!== "artist"){
                return res.status(403).json({message:"You dont have access"});

            }

            req.user= decoded;

             next();

         } catch(err){
        return res.status(401).json({message: "Unauthorised"});
    }
}

async function authUser(req, res, next) {
    let decoded;
    
        const token= req.cookies?.token || req.headers?.authorization?.replace(/^Bearer\s+/i, '');
    
        if(!token){
            return res.status(401).json({message: "Unauthorised"});
        }
    
        try{
             decoded= jwt.verify(token, process.env.JWT_SECRET);
    
            if(decoded.role !== "user" && decoded.role !== "artist"){
                return res.status(403).json({message:"You dont have access"});

            }

            req.user= decoded;

             next();

         } catch(err){
            console.log(err);
        return res.status(401).json({message: "Unauthorised"});
    }
}

module.exports= { authArtist, authUser};
const userModel= require("../models/user.model");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcryptjs");

async function registerUser(req, res) {

    const { username, email, password, role= "user"}= req.body

    const isUserAlreadyExists= await userModel.findOne({
        $or: [
            {username},
            {email},
        ]
    })

    if(isUserAlreadyExists) {
        return res.status(409).json({message: "user already exists"});
    }

    const hash= await bcrypt.hash(password,10);

    const user= await userModel.create({
        username,
        email,
        password: hash,
        role,
    })

    const token= jwt.sign({
        id: user._id,
        role: user.role,
    },process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message:"user registered successfully",
        token,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    })


}


async function loginUser(req, res) {

    const { username, email, password, identifier }= req.body;
    const searchTerms = [];
    if (username) searchTerms.push({ username });
    if (email) searchTerms.push({ email });
    if (identifier) {
        searchTerms.push({ username: identifier });
        searchTerms.push({ email: identifier });
    }

    if (searchTerms.length === 0) {
        return res.status(400).json({ message: "Username or email is required" });
    }

    const user= await userModel.findOne({
        $or: searchTerms
    })

    if(!user) {
        return res.status(401).json({message: "Invalid Credentials"});
    }

    const isPasswordValid= await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({message: "Invalid Credentials"});
    }

    const token= jwt.sign({
        id:user._id,
        role: user.role,
    },process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message:"user logged in successfully",
        token,
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    })
}


async function logoutUser(req, res) {
    res.clearCookie("token")
    res.status(200).json({message: "User logged out successfully"});
}

async function getMe(req, res) {
    const token = req.cookies?.token || req.headers?.authorization?.replace(/^Bearer\s+/i, '');
    if (!token) {
        return res.status(401).json({ message: "Unauthorised" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        res.status(401).json({ message: "Invalid session" });
    }
}

module.exports= { registerUser, loginUser, logoutUser, getMe }
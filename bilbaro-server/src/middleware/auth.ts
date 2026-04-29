import { Request , Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { request } from "node:http";

// extending express request type to add 'user' on it 

export interface AuthRequest extends Request{
    user?:{
        userId:string
        role:string
    }
}

const authMiddleware = (req:AuthRequest,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1]  //bearer token

    if(!token){
        return res.status(401).json({message:"no token provided , access denied"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {userId : string , role:string}
        req.user = decoded

        next()
        
    } catch (error) {
        res.status(401).json({message:"invalid token"})
    }
}


export default authMiddleware
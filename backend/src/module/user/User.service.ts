import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { IUser } from "./user.interface";
import config from "../../config/config";

const createUserToDb = async(userdata:IUser)=>{
    const {name,email,password,phone,role} = userdata;
    const userExits = await prisma.user.findUnique({where:{email}});
    if(userExits){
        throw new Error("user already exits");
    };
    if(role==="ADMIN"){
        throw new Error("plase type correct role");
    }
    const hashedPassword = await bcrypt.hash(password,Number(config.access_token_salt_round));
    const user = prisma.user.create({
        data:{
            name,
            email,
            phone,
            password:hashedPassword,
            role,
        }
    });

    return user;
};

const updateUser = async (id:string, data:any)=>{
    return await prisma.user.update({ where:{id}, data:{ ...(data.is_Banned !== undefined ? {is_Banned:Boolean(data.is_Banned)} : {}), ...(data.role ? {role:data.role} : {}) }, omit:{password:true} });
};

const getallUserFromDb = async()=>{
    const user = await prisma.user.findMany({
        omit:{
            password:true
        }
    });
    return user;
}


export const userService = {
    createUserToDb,getallUserFromDb,updateUser
}
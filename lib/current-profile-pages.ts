import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

//This is specifically made for socket io connection done in pages folder separately
//as at time of development the app router does not support sockets

export const currentProfilePages = async (req:NextApiRequest)=>{
    const { userId } = getAuth(req);

    if(!userId){
        return null;
    }

    const profile= await db.profile.findUnique({
        where: {
            userId : userId
        }
    });

    return profile;
}
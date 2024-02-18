import { PrismaClient } from "@prisma/client";

declare global {
    var prisma : PrismaClient | undefined;
};

export const db = globalThis.prisma || new PrismaClient();

//to prevent multiple client formation during development
//as in dev we have hmr which would reload it again and again however a global
//is static and is only generated once 
if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = db;
}
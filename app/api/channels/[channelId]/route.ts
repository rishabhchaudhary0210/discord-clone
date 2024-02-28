import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
    req:Request,
    { params } : {params : { channelId: string}}
){
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized User", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId){
            return new NextResponse("Server Id Missing", { status: 400 });
        }

        if(!params.channelId){
            return new NextResponse("Channel Id Missing", { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels:{
                    delete:{
                        id: params.channelId,
                        name: {
                            not: "general",
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
    }
    catch(error){
        console.log("DELETE CHANNEL", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function PATCH(
    req:Request,
    { params } : {params : { channelId: string}}
){
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized User", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if(!serverId){
            return new NextResponse("Server Id Missing", { status: 400 });
        }

        if(!params.channelId){
            return new NextResponse("Channel Id Missing", { status: 400 });
        }

        const { name, type } = await req.json();
        
        if(name === "general"){
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels:{
                    update: {
                        where: {
                            id : params.channelId,
                            name: {
                                not: "general"
                            },
                        },
                        data: {
                            name,
                            type,
                        }
                    }
                }
            }
        })

        return NextResponse.json(server);
    }
    catch(error){
        console.log("PATCH CHANNEL", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
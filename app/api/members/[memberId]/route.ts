import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    { params } : { params: {memberId: string}}
){
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized access", { status : 401 });
        }

        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        const serverId = searchParams.get("serverId");
        if(!serverId){
            return new NextResponse("Server ID Missing", { status: 400 });
        }
        if(!params.memberId){
            return new NextResponse("Member Id missing", { status: 400 });
        }
        
        const server = await db.server.update({
            where:{
                id: serverId,
                profileId: profile.id,
            },
            data:{
                members:{
                    update:{
                        where:{
                            id: params.memberId,
                            profileId: {
                                // just to check that accidentaly the admin does not change itself
                                not: profile.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include :{
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy:{
                        role:"asc",
                    }
                }
            }
        });

        return NextResponse.json(server);
    }
    catch(err){
        console.log("MEMBER PATCH", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    {params}: {params : {memberId: string}} 
){
    try{
        const profile = await currentProfile();
        if(!profile){
            return new NextResponse("Unauthorized", {status:401});
        }

        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if(!serverId){
            return new NextResponse("Server Id Missing", { status: 401 });
        }

        if(!params.memberId){
            return new NextResponse("Member ID Missing", { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id : serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId:{
                            not: profile.id,
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    }
    catch(error){
        console.log("MEMBER DELETE", error);
        return new NextResponse("Internal Error", { status : 500 })
    }
}
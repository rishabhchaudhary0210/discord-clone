import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

export const ServerSiderbar = async ({serverId}:{serverId:string})=>{
    
    const profile = await currentProfile();
    
    if(!profile) {
        return redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id : serverId,
        },
        include : {
            channels : {
                orderBy : {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy : {
                    role: "asc"
                }
            }
        }
    });

    if(!server){
        return redirect("/");
    }

    //separating different types of channels
    const textChannels = server?.channels?.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels?.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels?.filter((channel) => channel.type === ChannelType.VIDEO)

    //removing our profile id from members - we dont need to show us to ourself
    const members = server?.members?.filter((member) => member.profileId === profile.id)

    //getting our role from members
    const role = server?.members?.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    )
}
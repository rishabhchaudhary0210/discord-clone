import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdProps {
    params: {
        serverId: string,
    }
}

const ServerId = async ({
    params,
}: ServerIdProps)=>{

    const profile = await currentProfile();
    if(!profile){
        return redirectToSignIn();
    }

    const server = await db.server.findUnique({
        where: {
            id: params?.serverId,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general",
                }
            }
        }
    })
    
    const initialChannel = server?.channels[0];
    
    //just for sake of checking ideally would never happen as we dont allow deleting general
    if(initialChannel?.name !== "general"){
        return null;
    }

    return redirect(`/servers/${params?.serverId}/channels/${initialChannel?.id}`);

}

export default ServerId;
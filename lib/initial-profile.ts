import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

//a util function that helps get the current user if it has not made a profile
//we can create a new user from data from clerk login
//we have made such that firstly user will have to login on our app whenever he arrives
export const initialProfile = async ()=>{
    const user = await currentUser();

    //if user not found that is logged out so get to sign in page
    if(!user){
        return redirectToSignIn();
    }

    //if logged in check if existing in db if yes proceed to srever else go on creating a profile
    const profile = await db.profile.findUnique({
        where : {
            userId : user.id
        }
    });

    if(profile){
        return profile;
    }
    const newProfile = await db.profile.create({
        data:{
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })
    
    return newProfile;
}
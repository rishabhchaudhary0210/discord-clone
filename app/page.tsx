import { redirect } from "next/navigation"
;
import { initialProfile } from "@/lib/initial-profile"
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";

const Home = async () => {
  //getting or creating a user's progfile
  const profile = await  initialProfile();
  //if we have a user we need to show him a server so we get the latest server added in his profile
  const server = await db.server.findFirst({
    where: {
      members:{
        some:{
          profileId: profile.id
        }
      }
    }
  })

  //if user has joined a server we redirect him to that srver page
  if(server){
    return redirect(`/servers/${server.id}`);
  }

  return (
    <InitialModal/>
  )
}

export default Home
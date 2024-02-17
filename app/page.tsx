import { ModeToggle } from "@/components/mode-toggle"
import { UserButton } from "@clerk/nextjs"


const Home = () => {
  return (
    <div>
      <main className="">
        Hello from App  
        <UserButton
          afterSignOutUrl="/"
        />      
        <ModeToggle/>
      </main>
    </div>
  )
}

export default Home
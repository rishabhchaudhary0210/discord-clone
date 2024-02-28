import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { NavigationSiderbar } from "./navigation/navigation-siderbar";
import { ServerSiderbar } from "./server/server-sidebar";

export const MobileToggle = ({
    serverId
} : {
    serverId: string,
})=>{
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button 
                    variant={"ghost"}
                    size="icon"
                    className="md:hidden"
                >
                    <Menu/>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="p--0 flex gap-0"
            >
                <div className="w-[72px]">
                    <NavigationSiderbar/>
                </div>
                <ServerSiderbar
                    serverId={serverId}
                />
            </SheetContent>
        </Sheet>
    )
}
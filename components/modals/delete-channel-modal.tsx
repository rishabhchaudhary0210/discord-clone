"use client";

import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';


export const DeleteChannelModal = () => {

    const router = useRouter();
    const { isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async ()=>{
        try{
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                }
            });
            await axios.delete(url);

            onClose();
            router.push(`/servers/${server?.id}`);
            router.refresh();
        }
        catch(error){
            console.log(error);
        }
        finally{
            setIsLoading(false);
        }
    }

    return (
        // shad cn diaglog and form is beign used
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle>
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to do this ? <br/> <span className='font-semibold text-indigo-500'>#{channel?.name}</span> will be deleted permanently.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='bg-grapy-100 px-6 py-4'>
                    <div
                        className='flex items-center justify-between w-full'
                    >   
                        <Button 
                            disabled={isLoading}
                            onClick={onClose}
                            variant={"ghost"}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={isLoading}
                            variant={"primary"}
                            onClick={onClick}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
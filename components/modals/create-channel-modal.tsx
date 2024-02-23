"use client";

import qs from "query-string";

//installing shadcn form inbuilt installs reacthook forms and zod
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, redirect, useParams } from 'next/navigation'; 

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '../ui/button';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Channel name is required.",
    }).refine(
        name => name !== 'general',
        {
            message: "Channel name cannot be 'general'",
        }
    ),
    type: z.nativeEnum(ChannelType),
})

export const CreateChannelModal = () => {
    const { isOpen, onClose, type } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "createChannel";

    //initialising react hook forms
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT,
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId,
                }
            });
            const response = await axios.post( url, values);
            form.reset();
            router.refresh();
        }
        catch(err){
            console.log(err);
        }
        finally{
            onClose();
        }
    }

    const HandleClose = ()=>{
        form.reset();
        onClose();
    }

    return (
        // shad cn diaglog and form is beign used
        <Dialog open={isModalOpen} onOpenChange={HandleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle>
                        Create New Channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                placeholder='Enter channel name'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel>
                                            Channel Type
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'
                                                >
                                                    <SelectValue
                                                       placeholder="Select a channel type" 
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map(type=>(
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className='capitalize'
                                                    >
                                                        {type.toLocaleLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-500 px-6 py-4'>
                            <Button disabled={isLoading} variant={'primary'} type='submit'>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
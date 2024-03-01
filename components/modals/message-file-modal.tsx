"use client";

//installing shadcn form inbuilt installs reacthook forms and zod
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from 'query-string';
import axios from "axios";
import { useRouter } from 'next/navigation'; 

import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import { Input } from '@/components/ui/input'
import { Button } from '../ui/button';

import { FileUpload } from '@/components/file-upload';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required.",
    })
})

export const MessageFileModal = () => {
   
    const router = useRouter();
    const {isOpen, onClose, type, data} = useModal();
    const { apiUrl , query } = data;
    const isModalOpen = isOpen && type === "messageFile";

    //initialising react hook forms
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });
            form.reset();
            router.refresh();
            HandleClose();
        }
        catch(err){
            console.log(err);
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
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Send a file as a message.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="fileUrl"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter className='bg-gray-500 px-6 py-4'>
                            <Button disabled={isLoading} variant={'primary'} type='submit'>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
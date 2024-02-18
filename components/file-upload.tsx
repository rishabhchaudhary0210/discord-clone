"use client"

import {X} from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/upload-thing";
import "@uploadthing/react/styles.css";

interface FielUploadProps {
    onChange: (url? : string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({
    onChange,
    value, 
    endpoint
} : FielUploadProps ) => {

    const fileType = value.split('.').pop();

    if(value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="upload"
                    className="rounded-full"
                />
                <button
                    onClick={() => onChange("")}
                    className="bg-indigo-500 text-white p-1 rounded-full shadow-sm absolute top-0 right-0 cursor-pointer hover:bg-indigo-600/80"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url)
            }}
            onUploadError={(error: Error)=>{
                console.log(error);
            }}
        />
    )
}
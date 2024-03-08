"use client";

import qs from "query-string";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Phone, PhoneOff } from "lucide-react";

import { ActionTooltip } from "../action-tooltip";

export const ChatAudioButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const isAudio = searchParams?.get("audio");

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                audio: isAudio ? undefined : true,
            },
        },
            { skipNull: true }
        );

        router.push(url);
    }

    const Icon = isAudio ? PhoneOff : Phone;
    const tooltipLabel = isAudio ? "End Audio Call" : "Start Audio Call";

    return (
        <ActionTooltip side="bottom" label={tooltipLabel}>
            <button onClick={onClick} 
                className="hover:opacity-75 transition mr-4"
            >
                <Icon
                    className="h-6 w-6 text-zinc-500 dark:to-zinc-400"
                />
            </button>
        </ActionTooltip>
    )
}
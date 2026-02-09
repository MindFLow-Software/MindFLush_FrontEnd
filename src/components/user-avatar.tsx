"use client"

import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { api } from "@/lib/axios"

export function UserAvatar({ src, name, className }: { src?: string | null, name: string, className?: string }) {
    const [imgUrl, setImgUrl] = useState<string | undefined>(undefined)

    const initials = useMemo(() => {
        if (!name) return ""
        const parts = name.trim().split(/\s+/)
        return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
    }, [name])

    useEffect(() => {
        async function fetchAuthImage() {
            if (!src) return setImgUrl(undefined)
            if (src.startsWith("http") || src.startsWith("blob:")) return setImgUrl(src)

            try {
                const response = await api.get(`/attachments/${src}`, { responseType: 'blob' })
                const url = URL.createObjectURL(response.data)
                setImgUrl(url)
                return () => URL.revokeObjectURL(url)
            } catch {
                setImgUrl(undefined)
            }
        }
        fetchAuthImage()
    }, [src])

    return (
        <Avatar className={cn("h-10 w-10 border shrink-0 bg-muted", className)}>
            <AvatarImage src={imgUrl} className="object-cover" />
            <AvatarFallback className="font-bold text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>
    )
}
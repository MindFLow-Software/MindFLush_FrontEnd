"use client"

import { useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
    src?: string | null
    name: string
    className?: string
}

export function UserAvatar({ src, name, className }: UserAvatarProps) {
    // 1. Gera apenas as iniciais (Ex: "Paulo Straforini" -> "PS")
    const initials = useMemo(() => {
        if (!name) return ""
        const parts = name.trim().split(/\s+/)
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return parts[0][0].toUpperCase()
    }, [name])

    // 2. Resolve a URL de forma inteligente para evitar duplicação
    const resolvedSrc = useMemo(() => {
        if (!src) return undefined

        // Se já for um link completo (Blob de preview ou URL do backend), não mexe
        if (src.startsWith("http") || src.startsWith("blob:")) {
            return src
        }

        // Se for apenas o UUID, monta a URL do anexo
        const baseUrl = import.meta.env.VITE_API_URL
        return `${baseUrl}/attachments/${src}`
    }, [src])

    return (
        <Avatar className={cn("h-10 w-10 border shrink-0 overflow-hidden bg-muted", className)}>
            <AvatarImage
                src={resolvedSrc}
                alt={name}
                className="object-cover h-full w-full"
            />
            <AvatarFallback className="flex items-center justify-center text-muted-foreground font-medium select-none uppercase">
                {initials}
            </AvatarFallback>
        </Avatar>
    )
}
"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/user-avatar"
import { Copy } from "lucide-react"

interface PatientDetailsHeaderProps {
    patient: {
        id: string
        firstName: string
        lastName: string
        status: "active" | "inactive"
        profileImageUrl: string | null
    }
}

function StatusDot({ status }: { status: "active" | "inactive" }) {
    return (
        <span className={cn("relative flex h-2 w-2", status === "active" && "animate-pulse")}>
            {status === "active" && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"
            )} />
        </span>
    )
}

export function PatientDetailsHeader({ patient }: PatientDetailsHeaderProps) {
    const shortId = useMemo(() => patient.id.substring(0, 10).toUpperCase(), [patient.id])
    const fullName = `${patient.firstName} ${patient.lastName}`

    const handleCopyId = () => {
        navigator.clipboard.writeText(patient.id)
    }

    return (
        <TooltipProvider delayDuration={200}>
            <header className="flex flex-col gap-5 pb-6">
                <div className="flex items-center gap-4">

                    <div className="relative shrink-0">
                        <UserAvatar
                            src={patient.profileImageUrl}
                            name={fullName}
                            className="h-16 w-16 border-2 border-background shadow-md ring-1 ring-border"
                        />

                        <span className={cn(
                            "absolute -bottom-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 border-background",
                            patient.status === "active" ? "bg-emerald-500" : "bg-muted-foreground/40"
                        )}>
                            {patient.status === "active" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" />}
                        </span>
                    </div>

                    <div className="flex min-w-0 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                {fullName}
                            </h1>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "shrink-0 gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5",
                                    patient.status === "active"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-border bg-muted text-muted-foreground"
                                )}
                            >
                                <StatusDot status={patient.status} />
                                {patient.status === "active" ? "Ativo" : "Inativo"}
                            </Badge>
                        </div>

                        <div className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Copy className="h-3 w-3 opacity-50 group-hover:opacity-100" />

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={handleCopyId}
                                        className="cursor-pointer font-mono text-[11px] tracking-wide bg-muted/50 px-1.5 py-0.5 rounded transition-colors hover:text-primary"
                                    >
                                        ID: {shortId}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="text-xs">
                                    Copiar ID
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-border" role="separator" />
            </header>
        </TooltipProvider>
    )
}

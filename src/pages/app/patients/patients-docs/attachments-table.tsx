"use client"

import {
    FileText,
    ExternalLink,
    Trash2,
    User,
    Paperclip
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Attachment } from "@/api/attachments"

interface AttachmentsTableProps {
    attachments: Attachment[]
    isLoading: boolean
    onDelete: (id: string) => void
    perPage?: number
}

export function AttachmentsTable({ attachments, isLoading, onDelete, perPage = 10 }: AttachmentsTableProps) {
    const columnCount = 5

    const formatBytes = (bytes: number | undefined | null) => {
        const value = Number(bytes)
        if (isNaN(value) || value <= 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(value) / Math.log(k))
        const unitIndex = Math.min(i, sizes.length - 1)
        return `${parseFloat((value / Math.pow(k, unitIndex)).toFixed(2))} ${sizes[unitIndex]}`
    }

    const getFileTypeConfig = (contentType: string) => {
        const type = contentType.split('/')[1]?.toUpperCase() || 'FILE'
        const configs: Record<string, { className: string }> = {
            PDF: { className: "bg-red-500/10 text-red-600 border-red-500/20" },
            PNG: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
            JPG: { className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
            JPEG: { className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
            DOC: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
            DOCX: { className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
        }
        return { type, className: configs[type]?.className || "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" }
    }

    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30 whitespace-nowrap">
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Arquivo</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Paciente</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Tamanho</TableHead>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold">Data de Upload</TableHead>
                        <TableHead className="text-right pr-6 text-xs uppercase tracking-wider font-semibold">Ações</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        Array.from({ length: perPage }).map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-9 w-9 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-[140px]" />
                                            <Skeleton className="h-3 w-[60px]" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[120px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[80px]" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-3 w-[80px]" />
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-2">
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                        <Skeleton className="h-8 w-8 rounded-lg" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : attachments.length > 0 ? (
                        attachments.map((doc) => {
                            const fileType = getFileTypeConfig(doc.contentType)

                            return (
                                <TableRow
                                    key={doc.id}
                                    className="group hover:bg-muted/50 transition-[background-color,border-color] border-l-2 border-l-transparent hover:border-l-primary/50"
                                >
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
                                                <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-sm font-semibold text-foreground truncate max-w-[200px] cursor-default">
                                                                {doc.filename}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-xs font-medium">
                                                            {doc.filename}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <Badge
                                                    variant="outline"
                                                    className={`w-fit h-[18px] px-1.5 text-[9px] font-bold uppercase tracking-tight mt-1 ${fileType.className}`}
                                                >
                                                    {fileType.type}
                                                </Badge>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {doc.patient ? (
                                            <div className="flex items-center gap-2">
                                                <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                                                <span className="text-xs font-medium">
                                                    {doc.patient.firstName} {doc.patient.lastName}
                                                </span>
                                            </div>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 h-[20px] px-2 text-[10px] font-bold uppercase tracking-tight"
                                            >
                                                Sem Vínculo
                                            </Badge>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 border border-transparent font-mono text-xs font-medium tabular-nums">
                                            {formatBytes(doc.SizeInBytes)}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col tabular-nums">
                                            <span className="text-xs font-medium">
                                                {doc.uploadedAt ? format(new Date(doc.uploadedAt), "dd/MM/yyyy", { locale: ptBR }) : '--/--/----'}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground/70">
                                                {doc.uploadedAt ? format(new Date(doc.uploadedAt), "HH:mm", { locale: ptBR }) : '--:--'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 pr-2">
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            aria-label="Abrir arquivo"
                                                            onClick={() => doc.fileUrl && window.open(doc.fileUrl, '_blank')}
                                                            className="cursor-pointer h-8 w-8 rounded-lg transition-[color,background-color] text-muted-foreground hover:text-blue-600 hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                                                        >
                                                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-xs">Abrir arquivo</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            aria-label="Excluir arquivo"
                                                            onClick={() => onDelete(doc.id)}
                                                            className="cursor-pointer h-8 w-8 rounded-lg transition-[color,background-color] text-muted-foreground hover:text-red-600 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-blue-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-xs">Excluir</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columnCount} className="text-center text-muted-foreground py-20">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="p-4 rounded-full bg-muted">
                                        <Paperclip className="h-10 w-10 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm font-medium">Nenhum documento encontrado.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

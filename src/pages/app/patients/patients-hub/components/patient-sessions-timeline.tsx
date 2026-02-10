"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, History, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 🟢 Interface atualizada para ser compatível com os dados nulos do banco/API
interface Session {
    id: string
    sessionDate?: string | Date | null // Aceita null agora
    createdAt: string | Date
    status: string
    theme?: string | null
    content?: string | null
    duration?: string | number | null // Aceita string ou number (vimos que vem como string no erro)
}

interface PatientSessionsTimelineProps {
    sessions: Session[]
    meta: {
        totalCount: number
        perPage: number
    }
    pageIndex: number
    onPageChange: (newIndex: number) => void
}

export function PatientSessionsTimeline({
    sessions,
    meta,
    pageIndex,
    onPageChange
}: PatientSessionsTimelineProps) {
    const totalPages = Math.ceil(meta.totalCount / meta.perPage)

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center py-24 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
                <History className="h-10 w-10 opacity-20 mb-3" />
                <p className="text-sm font-semibold">Sem histórico de sessões</p>
                <p className="text-xs">As sessões realizadas aparecerão aqui.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                {sessions.map((session) => (
                    <div key={session.id} className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-background shadow-sm group-hover:scale-125 transition-transform" />

                        <div className="flex flex-col gap-1 bg-card p-5 rounded-2xl border hover:border-blue-200 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock className="h-3 w-3" />
                                    {/* 🟢 Fallback seguro para datas nulas */}
                                    {format(new Date(session.sessionDate ?? session.createdAt), "dd MMM yyyy '•' HH:mm", { locale: ptBR })}
                                </span>
                                <Badge variant="outline" className="text-[9px] uppercase px-2 bg-muted/30">
                                    {session.status}
                                </Badge>
                            </div>

                            <p className="text-sm font-bold text-foreground">
                                {session.theme || 'Sessão de Acompanhamento'}
                            </p>

                            <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3">
                                {session.content || 'Nenhuma nota clínica detalhada para esta sessão.'}
                            </p>

                            {session.duration && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-muted/50">
                                    <Badge variant="secondary" className="text-[9px] rounded-md uppercase">
                                        {session.duration} Minutos
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
                <p className="text-xs text-muted-foreground font-medium">
                    Página {pageIndex + 1} de {totalPages || 1}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={pageIndex === 0}
                        onClick={() => onPageChange(pageIndex - 1)}
                        className="cursor-pointer"
                    >
                        <ChevronLeft className="size-4 mr-1" /> Anterior
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={(pageIndex + 1) >= totalPages}
                        onClick={() => onPageChange(pageIndex + 1)}
                        className="cursor-pointer"
                    >
                        Próxima <ChevronRight className="size-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
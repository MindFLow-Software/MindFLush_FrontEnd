"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { ThumbsUp, Loader2, TrendingUp, Calendar, User } from "lucide-react"
import { format, parseISO, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getMostVotedSuggestions } from "@/api/get-most-voted-suggestions"

const CATEGORY_LABELS: Record<string, string> = {
    UI_UX: "UI / UX",
    SCHEDULING: "Agendamentos",
    REPORTS: "Relatórios",
    PRIVACY_LGPD: "Privacidade / LGPD",
    INTEGRATIONS: "Integrações",
    OTHERS: "Outros",
}

export function MostVotedSuggestionsCard() {
    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["admin", "suggestions", "most-voted"],
        queryFn: getMostVotedSuggestions,
    })

    return (
        <Card className="col-span-full lg:col-span-4 border-slate-200/80 bg-gradient-to-b from-slate-50 to-white shadow-md rounded-2xl overflow-hidden flex flex-col">
            <CardHeader className="border-b border-slate-100 bg-white/50 space-y-1 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="size-4 text-[#27187E]" />
                        <CardTitle className="text-base font-bold text-slate-800">Sugestões em Alta</CardTitle>
                    </div>
                </div>
                <CardDescription className="text-xs font-medium text-slate-500">
                    Ideias mais apoiadas pela comunidade
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex-1">
                {isLoading ? (
                    <div className="flex h-[300px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-slate-300" /></div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {suggestions?.map((item) => <SuggestionItem key={item.id} item={item} />)}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function SuggestionItem({ item }: { item: any }) {
    // 🟢 Melhoria na conversão da data
    const formattedDate = React.useMemo(() => {
        if (!item.createdAt) return "Data não informada"
        const date = typeof item.createdAt === 'string' ? parseISO(item.createdAt) : new Date(item.createdAt)

        return isValid(date)
            ? format(date, "dd 'de' MMMM", { locale: ptBR })
            : "Data inválida"
    }, [item.createdAt])

    const categoryLabel = CATEGORY_LABELS[item.category] || item.category || "Não Categorizado"

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="p-4 hover:bg-white transition-all flex items-center justify-between group cursor-pointer">
                    <div className="space-y-1 pr-4">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-[#27187E] transition-colors line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl border border-slate-200">
                        <ThumbsUp className="size-3.5" />
                        <span className="text-xs font-black">{item.likesCount ?? item.likes?.length ?? 0}</span>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] border-[#27187E]/10 gap-6 rounded-2xl">
                <DialogHeader>
                    <div className="mb-2">
                        <span className="text-[10px] bg-[#27187E]/10 text-[#27187E] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {categoryLabel}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-slate-900">{item.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{item.description}</p>
                    </div>

                    <footer className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-dashed border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><User className="size-4" /></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-slate-400">Autor</span>
                                <span className="text-sm font-bold text-slate-700">{item.psychologistName || "Não identificado"}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200"><Calendar className="size-4" /></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-slate-400">Postado em</span>
                                <span className="text-sm font-bold text-slate-700">{formattedDate}</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </DialogContent>
        </Dialog>
    )
}
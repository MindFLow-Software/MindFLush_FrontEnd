"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import {
    FileText,
    Save,
    Bold,
    Italic,
    Underline,
    ChevronDown,
    Minus,
    Plus,
    List
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SessionNotesCardProps {
    notes: string
    isSessionActive: boolean
    onNotesChange: (value: string) => void
    maxLength?: number
    onSaveDraft?: () => void
}

export function SessionNotesCard({
    notes = "",
    isSessionActive,
    onNotesChange,
    maxLength = 8000,
    onSaveDraft,
}: SessionNotesCardProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [fontSize, setFontSize] = useState(14)

    // Ajuste automático de altura
    useEffect(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    }, [notes])

    const applyFormat = (symbol: string, type: 'wrap' | 'prefix' = 'wrap') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = notes.substring(start, end)

        let newText = ""
        if (type === 'wrap') {
            newText = notes.substring(0, start) + `${symbol}${selectedText}${symbol}` + notes.substring(end)
        } else {
            newText = notes.substring(0, start) + `${symbol} ` + notes.substring(end)
        }

        onNotesChange(newText)
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + symbol.length, end + symbol.length)
        }, 0)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.ctrlKey || e.metaKey)) {
            if (e.key === 'b') { e.preventDefault(); applyFormat('**'); }
            if (e.key === 'i') { e.preventDefault(); applyFormat('*'); }
            if (e.key === 'u') { e.preventDefault(); applyFormat('__'); }
        }
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onNotesChange(e.target.value.substring(0, maxLength))
    }

    const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
    const isNearLimit = notes.length > maxLength * 0.9

    return (
        <Card className={cn(
            "w-full transition-all duration-300",
            !isSessionActive ? "opacity-60 pointer-events-none bg-muted/20" : "bg-card shadow-sm"
        )}>
            <CardHeader className="space-y-3 pb-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                            isSessionActive
                                ? "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm"
                                : "bg-muted text-muted-foreground"
                        )}>
                            <FileText className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <div>
                            <CardTitle className="text-base font-semibold tracking-tight">
                                Anotações da Sessão
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5">
                                {isSessionActive ? "Registre a evolução do paciente" : "Sessão inativa"}
                            </CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <div className="bg-muted/5 border-b border-border/40 px-4 py-2">
                <div className="flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-1 px-2 py-1 bg-background border rounded-md cursor-default hover:bg-muted/50 transition-colors">
                        <span className="text-[11px] font-medium px-1">Normal</span>
                        <ChevronDown size={12} className="text-muted-foreground" />
                    </div>
                    <div className="w-[1px] h-6 bg-border/60 mx-1" />
                    <div className="flex items-center border rounded-md bg-background overflow-hidden h-8">
                        <button onClick={() => setFontSize(s => Math.max(8, s - 1))} className="px-2 hover:bg-muted border-r"><Minus size={10} /></button>
                        <span className="text-[11px] font-mono px-3 min-w-[32px] text-center">{fontSize}</span>
                        <button onClick={() => setFontSize(s => s + 1)} className="px-2 hover:bg-muted border-l"><Plus size={10} /></button>
                    </div>
                    <div className="w-[1px] h-6 bg-border/60 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('**')}><Bold size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('*')}><Italic size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('__')}><Underline size={14} /></Button>
                    <div className="w-[1px] h-6 bg-border/60 mx-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => applyFormat('-', 'prefix')}><List size={14} /></Button>
                </div>
            </div>

            {/* 3. Área de Escrita */}
            <CardContent className="p-0">
                <textarea
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Inicie sua evolução clínica aqui..."
                    value={notes}
                    onChange={handleTextChange}
                    disabled={!isSessionActive}
                    style={{ fontSize: `${fontSize}px` }}
                    className={cn(
                        "w-full block min-h-[350px] resize-none px-12 py-10",
                        "whitespace-pre-wrap break-words",
                        "bg-white text-slate-800 leading-relaxed outline-none",
                        "placeholder:text-muted-foreground/30 placeholder:italic",
                    )}
                />

                {/* Footer de Status */}
                <div className="flex items-center justify-between px-6 py-3 bg-muted/5 border-t border-border/40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>{wordCount} palavras</span>
                            <span className="opacity-30">|</span>
                            <span className={cn(isNearLimit && "text-amber-600")}>
                                {notes.length.toLocaleString()} / {maxLength.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <Button
                        onClick={onSaveDraft}
                        disabled={!notes.trim() || !isSessionActive}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4 text-[10px] font-bold uppercase tracking-wider rounded-md gap-2 shadow-sm transition-all active:scale-95"
                    >
                        <Save size={14} />
                        Salvar Evolução
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Download, FileText, ArrowLeft, Loader2 } from "lucide-react"
import { pdf } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// Importe o seu template (ajuste o caminho se necessário)
import { SessionPDFTemplate } from "../../../../utils/session-pdf-template"

interface EvolutionViewerProps {
    patientName: string
    content: string
    date: string
    diagnosis?: string
    psychologist: { name: string; crp: string }
    onBack: () => void
}

export function EvolutionViewer({
    patientName,
    content,
    date,
    diagnosis,
    psychologist,
    onBack
}: EvolutionViewerProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const handleExportPDF = async () => {
        try {
            setIsGenerating(true)

            // 1. Gera o Blob do PDF usando o seu template
            const blob = await pdf(
                <SessionPDFTemplate
                    psychologist={psychologist}
                    patientName={patientName}
                    date={format(new Date(date), "dd/MM/yyyy")}
                    content={content || "Nenhuma evolução registrada."}
                    diagnosis={diagnosis || "Não informado"}
                />
            ).toBlob()

            // 2. Cria o link e dispara o download
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Evolucao-${patientName.replace(/\s+/g, '-')}-${format(new Date(date), "dd-MM-yyyy")}.pdf`
            link.click()

            // 3. Limpeza
            URL.revokeObjectURL(url)
            toast.success("PDF gerado com sucesso!")
        } catch (error) {
            console.error("Erro ao gerar PDF:", error)
            toast.error("Erro ao gerar o arquivo PDF.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="w-full mx-auto space-y-6 py-2">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="cursor-pointer h-8 px-2 -ml-2 text-muted-foreground hover:text-slate-900 gap-1.5 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span className="text-xs font-medium">Voltar ao histórico</span>
                </Button>
            </div>

            {/* Cabeçalho */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-900">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <h2 className="text-xl font-semibold tracking-tight">
                        Evolução Psicológica
                    </h2>
                </div>

                <div className="flex items-center justify-between mt-3 text-sm">
                    <p className="text-muted-foreground">
                        Paciente: <span className="font-medium text-slate-700">{patientName}</span>
                    </p>
                    <p className="text-muted-foreground tabular-nums">
                        {format(new Date(date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </p>
                </div>
            </div>

            <Separator className="bg-slate-100" />

            {/* Área do Conteúdo */}
            <div className="min-h-[180px] px-1">
                <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-700">
                    {content || "Nenhuma anotação registrada para esta sessão."}
                </p>
            </div>

            <Separator className="bg-slate-100" />

            {/* Rodapé e Ação */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                <p className="text-[11px] leading-relaxed text-slate-400 italic max-w-sm">
                    Este documento é sigiloso e de uso restrito, gerado a partir de registro eletrônico de prontuário.
                </p>

                <Button
                    onClick={handleExportPDF}
                    disabled={isGenerating}
                    className="cursor-pointer w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-all px-8 h-10 shadow-sm"
                >
                    {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isGenerating ? "Gerando..." : "Gerar PDF Oficial"}
                </Button>
            </div>
        </div>
    )
}
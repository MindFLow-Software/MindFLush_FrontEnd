"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { createSuggestion } from "@/api/create-suggestion"
import { SuggestionAttachments } from "./suggestion-attachments" // 🟢 Importação corrigida

const suggestionSchema = z.object({
    title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
    description: z.string().min(10, "Detalhe um pouco mais sua sugestão"),
    category: z.enum(["UI_UX", "SCHEDULING", "REPORTS", "PRIVACY_LGPD", "INTEGRATIONS", "OTHERS"]),
})

type SuggestionSchema = z.infer<typeof suggestionSchema>

export function SuggestionForm() {
    const [files, setFiles] = useState<File[]>([])
    const [formKey, setFormKey] = useState(0)

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting },
    } = useForm<SuggestionSchema>({
        resolver: zodResolver(suggestionSchema),
    })

    async function onSubmit(data: SuggestionSchema) {
        try {
            await createSuggestion({ ...data, files })
            toast.success("Sugestão enviada com sucesso!")

            reset()
            setFiles([])
            setFormKey(prev => prev + 1)
        } catch (error) {
            toast.error("Erro ao enviar sugestão.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título</Label>
                    <Input {...register("title")} placeholder="Ex: Melhoria no fluxo de agendamento" />
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</Label>
                    <Select key={formKey} onValueChange={(v) => setValue("category", v as any)}>
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="UI_UX">Interface (UI/UX)</SelectItem>
                            <SelectItem className="cursor-pointer" value="SCHEDULING">Agendamentos</SelectItem>
                            <SelectItem className="cursor-pointer" value="REPORTS">Relatórios</SelectItem>
                            <SelectItem className="cursor-pointer" value="PRIVACY_LGPD">Privacidade & LGPD</SelectItem>
                            <SelectItem className="cursor-pointer" value="INTEGRATIONS">Integrações</SelectItem>
                            <SelectItem className="cursor-pointer" value="OTHERS">Outros</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Descrição</Label>
                    <Textarea
                        {...register("description")}
                        className="min-h-[120px] max-h-[260px] resize-none overflow-y-auto"
                        placeholder="Como podemos melhorar?"
                    />
                </div>

                <SuggestionAttachments
                    files={files}
                    onFileChange={setFiles}
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full bg-[#27187E] hover:bg-[#27187E]/90 text-white font-bold gap-2 mt-2"
            >
                {isSubmitting ? (
                    <Loader2 className="animate-spin size-4" />
                ) : (
                    <>
                        Enviar Sugestão
                        <Send className="size-4" />
                    </>
                )}
            </Button>
        </form>
    )
}
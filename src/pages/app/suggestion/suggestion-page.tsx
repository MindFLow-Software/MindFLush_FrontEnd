"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Lightbulb, Info } from "lucide-react"
import { useHeaderStore } from "@/hooks/use-header-store"
import { SuggestionForm } from "./components/suggestion-form"

export function SuggestionPage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Central de Sugestões')
    }, [setTitle])

    return (
        <>
            <Helmet title="Central de Sugestões" />

            <div className="flex flex-col gap-8 mt-6 ">
                {/* Header Section */}
                <div className="flex flex-col gap-2 border-l-4 border-[#27187E] pl-4 py-1">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">
                        Central de Sugestões
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Tem uma ideia para melhorar sua rotina? Compartilhe conosco!
                        <span className="block md:inline md:ml-1 font-medium text-[#27187E]/80">
                            Sua ideia ajuda a construir o futuro da plataforma. ❤️
                        </span>
                    </p>
                </div>

                {/* Info Section - Agora alinhado na mesma largura */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-xl border bg-[#27187E]/5 p-6 border-[#27187E]/10 flex flex-col justify-center">
                        <h3 className="font-bold text-[#27187E] mb-3 flex items-center gap-2">
                            <Lightbulb className="size-4" />
                            Como sugerir?
                        </h3>
                        <ul className="text-xs space-y-3 text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="font-bold text-[#27187E]">01.</span>
                                Seja específico no título para facilitar a triagem.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-[#27187E]">02.</span>
                                Explique o problema e como a sugestão o resolveria.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-[#27187E]">03.</span>
                                Anexar prints ajuda a entender o contexto visual.
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border p-6 bg-card shadow-sm flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="size-4 text-[#27187E]" />
                            <h3 className="font-bold text-sm">Privacidade</h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Suas sugestões são lidas diretamente pela nossa equipe de produto.
                            <strong> Por segurança, nunca inclua dados sensíveis ou nomes de pacientes nos anexos.</strong>
                        </p>
                    </div>
                </div>

                {/* Formulário - Ocupando a mesma largura total */}
                <div className="w-full">
                    <SuggestionForm />
                </div>
            </div>
        </>
    )
}
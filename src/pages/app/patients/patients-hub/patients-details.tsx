"use client"

import { useParams } from "react-router-dom"
import {
    User, FileText, Activity, DollarSign, ShieldCheck,
    Download, Lock, Plus, Filter, FileSearch, CheckCircle2, AlertCircle, History
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PatientDetails() {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="flex flex-col gap-6 p-6 bg-background min-h-screen">

            {/* HEADER: Resumo RÃ¡pido & AÃ§Ãµes CrÃ­ticas */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
                        <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Ana Beatriz Silva</h1>
                        <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-emerald-600 bg-emerald-50">Ativa</Badge>
                            <Badge variant="secondary" className="text-[10px] uppercase">ID: {id || 'MF-8829'}</Badge>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5">
                        <Download className="h-4 w-4" /> Exportar PDF Criptografado
                    </Button>
                    <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4" /> Nova SessÃ£o
                    </Button>
                </div>
            </header>

            {/* DASHBOARD: MÃ©tricas 360Â° */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card shadow-sm border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                            <Activity className="h-3 w-3" /> EvoluÃ§Ã£o ClÃ­nica
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">12 SessÃµes</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Ãšltima atualizaÃ§Ã£o: hÃ¡ 2 dias</p>
                    </CardContent>
                </Card>

                <Card className="bg-card shadow-sm border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                            <DollarSign className="h-3 w-3" /> Resumo Financeiro
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-emerald-600">R$ 1.800,00</p>
                        <p className="text-[10px] text-muted-foreground mt-1">0 pendÃªncias em aberto</p>
                    </CardContent>
                </Card>

                <Card className="bg-card shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3" /> SeguranÃ§a & LGPD
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-semibold text-amber-700">Consentimento Ativo</p>
                            <p className="text-[10px] text-muted-foreground">VÃ¡lido atÃ© 2027</p>
                        </div>
                        <Lock className="h-5 w-5 text-amber-500 opacity-50" />
                    </CardContent>
                </Card>
            </div>

            {/* SEÃ‡ÃƒO PRINCIPAL: Tabs de NavegaÃ§Ã£o */}
            <Tabs defaultValue="clinical" className="w-full">
                <TabsList className="grid grid-cols-4 w-full md:w-[600px] bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="clinical" className="rounded-lg">Dados ClÃ­nicos</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg">Timeline</TabsTrigger>
                    <TabsTrigger value="docs" className="rounded-lg">Documentos</TabsTrigger>
                </TabsList>

                {/* TAB: DADOS CLÃNICOS & LGPD */}
                <TabsContent value="clinical" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="personal">
                                    <AccordionTrigger className="text-sm font-bold">Dados Pessoais & Contato</AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-muted-foreground">CPF:</span> 000.000.000-00</div>
                                        <div><span className="text-muted-foreground">Celular:</span> (11) 98888-7777</div>
                                        <div className="col-span-2 border-t pt-2 mt-2">
                                            <span className="text-muted-foreground block mb-2 font-semibold">Consentimento LGPD:</span>
                                            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5" />
                                                <p className="text-xs text-emerald-800">
                                                    O paciente autorizou o tratamento de dados sensÃ­veis para fins terapÃªuticos e recebimento de notas fiscais via e-mail.
                                                    <br /><strong>Assinado digitalmente em: 15/01/2026.</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="clinical-notes">
                                    <AccordionTrigger className="text-sm font-bold">Anamnese & Queixa Principal</AccordionTrigger>
                                    <AccordionContent className="text-sm text-muted-foreground italic leading-relaxed">
                                        Paciente busca acompanhamento para manejo de ansiedade generalizada e regulaÃ§Ã£o emocional apÃ³s mudanÃ§a de cargo corporativo...
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB: TIMELINE DE SESSÃ•ES */}
                <TabsContent value="timeline" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
                        <h3 className="text-sm font-bold flex items-center gap-2"><History className="h-4 w-4" /> HistÃ³rico de Atendimentos</h3>
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><Filter className="h-3 w-3" /> Filtrar Data</Button>
                    </div>
                    <div className="relative border-l-2 border-muted ml-4 space-y-8 py-4">
                        {[1, 2].map((session) => (
                            <div key={session} className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-background" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">28 Jan 2026 â€¢ 14:00</span>
                                    <p className="text-sm font-semibold">SessÃ£o Individual - Terapia Cognitivo Comportamental</p>
                                    <p className="text-xs text-muted-foreground max-w-xl">EvoluÃ§Ã£o: Paciente demonstrou melhora na percepÃ§Ã£o de gatilhos externos...</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-[9px]">ANSIEDADE</Badge>
                                        <Badge variant="outline" className="text-[9px]">FOCO</Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* TAB: DOCUMENTOS COM PREVIEW & ALERTAS */}
                <TabsContent value="docs" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-rose-600"><AlertCircle className="h-4 w-4" /> Alertas de Documentos</h3>
                            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 space-y-3">
                                <p className="text-xs text-rose-800 font-medium">Atestado mÃ©dico vence em 3 dias (Vencimento: 06/02/2026)</p>
                                <Button variant="destructive" size="sm" className="w-full text-xs h-8">Solicitar AtualizaÃ§Ã£o</Button>
                            </div>

                            <div className="border rounded-xl p-6 border-dashed flex flex-col items-center justify-center text-center gap-3">
                                <FileText className="h-10 w-10 text-muted-foreground opacity-20" />
                                <div className="text-xs text-muted-foreground">Arraste documentos ou <span className="text-blue-600 font-bold underline cursor-pointer">faÃ§a upload</span></div>
                                <p className="text-[9px] opacity-50 italic">Suporta PDF, JPG, PNG (Max 10MB)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold flex items-center gap-2"><FileSearch className="h-4 w-4" /> Arquivos Recentes</h3>
                            <div className="space-y-2">
                                {['Contrato_Servicos.pdf', 'Evolucao_Semestral.pdf'].map(doc => (
                                    <div key={doc} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 rounded-md text-blue-600"><FileText className="h-4 w-4" /></div>
                                            <span className="text-xs font-medium">{doc}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}

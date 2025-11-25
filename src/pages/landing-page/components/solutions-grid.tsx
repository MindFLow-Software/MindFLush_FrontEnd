import { ShieldCheck, Video, BrainCircuit } from "lucide-react";

export function SolutionsGrid() {
    return (
        <section id="solucoes" className="bg-white py-24 scroll-mt-20">
            <div className="container mx-auto px-6 md:px-8 lg:px-12">

                {/* --- CABEÇALHO --- */}
                <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

                    {/* Título com Rabisco */}
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                            Uma suíte de{" "}
                            <span className="relative inline-block px-2">
                                soluções
                                {/* SVG do Rabisco (Círculo) */}
                                <svg className="absolute -bottom-2 -left-1 -right-1 h-12 w-[110%] text-blue-400 opacity-80" viewBox="0 0 200 60" fill="none" preserveAspectRatio="none">
                                </svg>
                            </span>
                            <br />
                            para o seu negócio.
                        </h2>
                    </div>

                    {/* Texto Descritivo */}
                    <div className="max-w-lg">
                        <p className="text-lg leading-relaxed text-slate-600">
                            Centralize as operações da sua clínica com uma suíte completa.
                            Nossa tecnologia une prontuários, telemedicina e automação para garantir que seu consultório evolua.
                        </p>
                    </div>
                </div>

                {/* --- GRID DE CARDS (Estilo Tabela) --- */}
                {/* 'divide-x' cria as bordas entre as colunas, 'divide-y' entre linhas no mobile */}
                <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-slate-200 divide-y divide-slate-200 md:divide-y-0">

                    {/* CARD 1: Segurança */}
                    <div className="group relative flex flex-col transition-colors hover:bg-slate-50/50">
                        {/* Área do Ícone (Topo) */}
                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px]">
                            {/* Simulação de Ícone 3D com CSS */}
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-4xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-3 ring-1 ring-slate-100">
                                <ShieldCheck className="h-10 w-10 text-green-500" strokeWidth={2.5} />
                                {/* Brilho sutil */}
                                <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Área de Texto (Base) */}
                        <div className="flex flex-1 flex-col border-t border-slate-100 p-8">
                            <h3 className="text-lg font-bold text-slate-900">Proteção de Dados.</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Detecte riscos e armazene dados sensíveis com criptografia de ponta a ponta, garantindo conformidade total com a LGPD.
                            </p>
                        </div>
                    </div>

                    {/* CARD 2: Telemedicina */}
                    <div className="group relative flex flex-col transition-colors hover:bg-slate-50/50">
                        {/* Área do Ícone */}
                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px]">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-3 ring-1 ring-slate-100">
                                <Video className="h-10 w-10 text-blue-500" strokeWidth={2.5} />
                                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Área de Texto */}
                        <div className="flex flex-1 flex-col border-t border-slate-100 p-8">
                            <h3 className="text-lg font-bold text-slate-900">Videochamada Integrada.</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Sala de atendimento segura, sem limite de tempo e sem precisar instalar nada. Seu paciente clica e entra.
                            </p>
                        </div>
                    </div>

                    {/* CARD 3: IA (Com Badge) */}
                    <div className="group relative flex flex-col transition-colors hover:bg-slate-50/50">

                        {/* Badge 'Em breve' */}
                        <div className="absolute right-6 top-6 z-10">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                                Em breve ! ! !
                            </span>
                        </div>

                        {/* Área do Ícone */}
                        <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[16px_16px]">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-4xl bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1 ring-1 ring-slate-100">
                                <BrainCircuit className="h-10 w-10 text-purple-500" strokeWidth={2.5} />
                                <div className="absolute inset-0 rounded-4xl bg-linear-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Área de Texto */}
                        <div className="flex flex-1 flex-col border-t border-slate-100 p-8">
                            <h3 className="text-lg font-bold text-slate-900">Assistente IA.</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                Ferramenta inteligente que ajuda a transcrever sessões e sugerir rascunhos de evolução clínica para você ganhar tempo.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
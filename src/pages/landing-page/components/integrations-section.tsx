import {
    ArrowRight,
    CreditCard,
    Mail,
    Calendar,
    Video,
    MessageCircle,
    Globe,
    Zap,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CreditCardIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

interface IntegrationCardProps {
    icon: React.ReactNode;
    label: string;
    color: string;
    delay?: number;
    x: string | number;
    y: string | number;
}

const FloatingCard = ({ icon, label, color, delay = 0, x, y }: IntegrationCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 0, y: 0 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
            }}
            transition={{
                y: {
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: delay
                },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
            }}
            className="absolute hidden lg:flex items-center gap-3 p-3 pr-5 bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl z-20 hover:scale-105 transition-transform cursor-default"
            style={{
                left: typeof x === 'number' ? `${x}%` : x,
                top: typeof y === 'number' ? `${y}%` : y,
                boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 16px -2px rgba(0, 0, 0, 0.05)"
            }}
        >
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color} text-white shadow-sm`}>
                {icon}
            </div>
            <span className="font-semibold text-slate-700 text-sm">{label}</span>
        </motion.div>
    );
};

export function IntegrationsSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50">

            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/10 blur-[120px] rounded-full opacity-60" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-indigo-400/10 blur-[100px] rounded-full opacity-40" />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center mb-16 lg:mb-24">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Integrações Poderosas</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mb-6"
                    >
                        Conecte as ferramentas que <br className="hidden md:block" />
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            você já ama usar
                            <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10"
                    >
                        O <span className="font-bold text-slate-800">MindFlush</span> trabalha em harmonia perfeita com sua agenda, videochamadas e ferramentas financeiras.
                        Sincronize tudo em um clique, <span className="text-blue-600 font-medium">sem complicação</span>.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link to="/sign-in">
                            <Button size="lg" className="cursor-pointer h-14 px-8 rounded-full text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 group">

                                Acesse agora
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Integrations Visualization */}
                <div className="relative h-[400px] w-full max-w-5xl mx-auto mt-12 hidden md:block">
                    {/* Center Hub */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 z-20">
                            <Zap className="w-12 h-12 text-blue-600 fill-blue-600" />
                            {/* Pulse Rings */}
                            <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/20 animate-ping [animation-duration:3s]" />
                            <div className="absolute -inset-4 rounded-[2rem] border border-blue-500/10 animate-pulse" />
                        </div>
                    </div>

                    {/* Connecting Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
                        <defs>
                            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                                <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* Lines connecting center to positions */}
                        <path d="M512 200 L 250 100" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M512 200 L 770 100" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M512 200 L 200 250" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M512 200 L 820 250" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M512 200 L 300 350" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                        <path d="M512 200 L 720 350" stroke="url(#line-gradient)" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>

                    {/* Left Side Cards */}
                    <FloatingCard
                        icon={<CreditCardIcon className="w-6 h-6" />}
                        label="Boleto & Pix"
                        color="bg-purple-600"
                        x="15%" y="15%"
                        delay={0}
                    />
                    <FloatingCard
                        icon={<Mail className="w-6 h-6" />}
                        label="Outlook Email"
                        color="bg-emerald-500"
                        x="10%" y="45%"
                        delay={1.5}
                    />
                    <FloatingCard
                        icon={<Calendar className="w-6 h-6" />}
                        label="Calendario"
                        color="bg-blue-600"
                        x="20%" y="75%"
                        delay={0.5}
                    />

                    {/* Right Side Cards */}
                    <FloatingCard
                        icon={<Users className="w-6 h-6" />}
                        label="Cadastro"
                        color="bg-sky-500"
                        x="70%" y="15%"
                        delay={1}
                    />
                    <FloatingCard
                        icon={<WhatsappLogoIcon className="w-6 h-6" />}
                        label="WhatsApp"
                        color="bg-green-500"
                        x="75%" y="45%"
                        delay={2}
                    />
                    <FloatingCard
                        icon={<Video className="w-6 h-6" />}
                        label="Videoconferência"
                        color="bg-violet-400"
                        x="65%" y="75%"
                        delay={0.2}
                    />

                </div>

                {/* Mobile Fallback for Integrations (Simple Grid) */}
                <div className="md:hidden grid grid-cols-2 gap-4 mt-12">
                    {[
                        { icon: CreditCard, label: "Stripe & Pix", color: "text-indigo-600 bg-indigo-50" },
                        { icon: Globe, label: "Google Agenda", color: "text-blue-600 bg-blue-50" },
                        { icon: Mail, label: "Email", color: "text-sky-600 bg-sky-50" },
                        { icon: MessageCircle, label: "WhatsApp", color: "text-green-600 bg-green-50" },
                        { icon: Calendar, label: "Calendar", color: "text-slate-700 bg-slate-100" },
                        { icon: Video, label: "Video Conf", color: "text-blue-500 bg-blue-50" },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

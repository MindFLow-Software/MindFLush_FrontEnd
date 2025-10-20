"use client"

import { Helmet } from "react-helmet-async"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerPsychologist } from "@/api/register-user"

export const signUpForm = z.object({
    firstName: z.string().min(1, "Primeiro nome é obrigatório"),
    lastName: z.string().min(1, "Último nome é obrigatório"),
    phoneNumber: z.string().min(1, "Telefone é obrigatório"),
    email: z.string().email("Email inválido").optional(),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").optional(),
    dateOfBirth: z.date(),
    cpf: z.string().min(11, "CPF inválido"),
    role: z.enum(["admin", "psychologist", "assistant"]),
    gender: z.enum(["male", "female", "other"]),
    expertise: z.enum(["clinical", "child", "adolescent", "couples", "organizational", "other"]),
    isActive: z.boolean().optional(),
    profileImageUrl: z.string().url().optional(),
    crp: z.string().optional(),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm<SignUpForm>()

    const { mutateAsync: registerPsychologistFn } = useMutation({
        mutationFn: registerPsychologist,
    })

    async function handleSignUp(data: SignUpForm) {
        try {
            await registerPsychologistFn({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                dateOfBirth: data.dateOfBirth,
                cpf: data.cpf,
                role: data.role,
                gender: data.gender,
                expertise: data.expertise,
            })

            toast.success("Psicólogo cadastrado com sucesso!", {
                action: {
                    label: "Login",
                    onClick: () => navigate(`/sign-in?email=${data.email}`),
                },
            })
        } catch (error) {
            toast.error("Erro ao cadastrar psicólogo.")
        }
    }

    return (
        <>
            <Helmet title="Criar conta | MindFlush" />

            <div className="p-8">
                <Button variant={"link"} asChild className="absolute right-8 top-8">
                    <Link to="/sign-in">Fazer Login</Link>
                </Button>

                <div className="flex w-full max-w-[450px] mx-auto flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta no MindFlush</h1>
                        <p className="text-sm text-muted-foreground">
                            Cadastre seu e-mail profissional para começar a usar a plataforma e oferecer uma experiência terapêutica
                            mais conectada.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Primeiro Nome</Label>
                                <Input id="firstName" {...register("firstName")} placeholder="Jon" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Último Nome</Label>
                                <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail profissional</Label>
                            <Input id="email" type="email" {...register("email")} placeholder="exemplo@mindflush.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Telefone</Label>
                                <Input id="phoneNumber" {...register("phoneNumber")} placeholder="(99) 99999-9999" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cpf">CPF</Label>
                                <Input id="cpf" {...register("cpf")} placeholder="123.456.789-00" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                            <Input id="dateOfBirth" type="date" {...register("dateOfBirth", { valueAsDate: true })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Função</Label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione sua função" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="psychologist">Psicólogo</SelectItem>
                                            <SelectItem value="assistant">Assistente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2">

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gênero</Label>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione seu gênero" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Masculino</SelectItem>
                                                <SelectItem value="female">Feminino</SelectItem>
                                                <SelectItem value="other">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="expertise">Especialidade</Label>
                                <Controller
                                    name="expertise"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione sua especialidade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="clinical">Clínica</SelectItem>
                                                <SelectItem value="child">Infantil</SelectItem>
                                                <SelectItem value="adolescent">Adolescente</SelectItem>
                                                <SelectItem value="couples">Casais</SelectItem>
                                                <SelectItem value="organizational">Organizacional</SelectItem>
                                                <SelectItem value="other">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">
                            {isSubmitting ? "Criando conta..." : "Criar conta"}
                        </Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                                termos de serviço
                            </a>{" "}
                            e{" "}
                            <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
                                políticas de privacidade
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

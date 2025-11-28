"use client"

import type React from "react"

import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"
import { useState, useCallback } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { signIn } from "@/api/sign-in"

const signInSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignInForm({ className, ...props }: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      password: "",
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  const handleSignIn = useCallback(
    async (data: SignInSchema) => {
      try {
        const response = await authenticate(data)
        localStorage.setItem("token", response.jwt)
        toast.success("Login realizado com sucesso!", { duration: 4000 })
        navigate("/dashboard")
      } catch (error: any) {
        console.error("❌ Erro no login:", error)
        if (error?.response?.status === 401) {
          toast.error("Credenciais inválidas. Verifique e tente novamente.")
        } else {
          toast.error("Ocorreu um erro inesperado. Tente novamente.")
        }
      }
    },
    [authenticate, navigate],
  )

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return (
    <>
      <Helmet title="Entrar no MindFlush" />
      <form onSubmit={handleSubmit(handleSignIn)} className={cn("flex flex-col gap-5", className)} {...props}>
        <FieldGroup>
          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email" className="text-sm font-medium">
              E-mail profissional
            </FieldLabel>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                placeholder="exemplo@mindflush.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn(
                  "pl-10 h-11 transition-all duration-200",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  errors.email && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                )}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <FieldDescription
                id="email-error"
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
                role="alert"
              >
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                {errors.email.message}
              </FieldDescription>
            )}
          </Field>

          {/* Password Field */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password" className="text-sm font-medium">
                Senha
              </FieldLabel>
              <Link
                to="/forgot-password"
                className="text-xs text-muted-foreground hover:text-blue-600 transition-colors underline-offset-4 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                size={18}
                aria-hidden="true"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={cn(
                  "pl-10 pr-10 h-11 transition-all duration-200",
                  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
                  errors.password && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <FieldDescription
                id="password-error"
                className="text-red-500 text-xs mt-1 flex items-center gap-1"
                role="alert"
              >
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                {errors.password.message}
              </FieldDescription>
            )}
          </Field>

          {/* Submit Button */}
          <Field className="pt-2">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </Field>

          <FieldSeparator>Ou</FieldSeparator>

          {/* Sign Up Link */}
          <Field>
            <FieldDescription className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/sign-up"
                className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-colors"
              >
                Criar conta
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </>
  )
}

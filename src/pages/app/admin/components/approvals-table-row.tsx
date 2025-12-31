"use client"

import { useState } from "react"
import { Check, X, Search, IdCardLanyard, Mail, Calendar } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { approvePsychologist } from "@/api/approvals"
import type { PendingPsychologist } from "@/api/approvals"

interface ApprovalsTableRowProps {
    psychologist: PendingPsychologist
}

export function ApprovalsTableRow({ psychologist }: ApprovalsTableRowProps) {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync: approveMutation, isPending: isApproving } = useMutation({
        mutationFn: approvePsychologist,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["pending-approvals"] })
            const previousData = queryClient.getQueryData(["pending-approvals"])

            queryClient.setQueryData(["pending-approvals"], (old: any) => ({
                ...old,
                psychologists: old.psychologists.filter((p: any) => p.id !== id),
            }))

            return { previousData }
        },
        onError: (_, __, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["pending-approvals"], context.previousData)
            }
            toast.error("Falha ao processar aprovação.")
        },
        onSuccess: () => {
            toast.success("Psicólogo aprovado com sucesso!")
        },
    })

    return (
        <TableRow className="group hover:bg-muted/30 transition-colors">
            <TableCell className="w-[50px]">
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-50 group-hover:opacity-100"
                                    onClick={() => setIsDetailsOpen(true)}
                                >
                                    <Search className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Visualizar documentos</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {isDetailsOpen && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Verificação de Credenciais</DialogTitle>
                                <DialogDescription>Confira os dados antes de aprovar.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">Nome Completo</p>
                                        <p className="font-medium">{psychologist.firstName} {psychologist.lastName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">CRP</p>
                                        <p className="font-mono">{psychologist.crp || "Não informado"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground">EMAIL</p>
                                        <p className="font-mono">{psychologist.email || "Não informado"}</p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {psychologist.firstName[0]}{psychologist.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{psychologist.firstName} {psychologist.lastName}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <IdCardLanyard className="h-3.5 w-3.5" />
                    <span className="font-mono text-xs">{psychologist.crp || "Não informado"}</span>
                </div>
            </TableCell>

            <TableCell>
                <div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {psychologist.email}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">{new Date(psychologist.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        className="cursor-pointer h-8 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => {/* Lógica de Rejeitar */ }}
                    >
                        <X className="h-4 w-4 mr-1" /> Rejeitar
                    </Button>
                    <Button
                        size="sm"
                        disabled={isApproving}
                        className="cursor-pointer h-8 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => approveMutation(psychologist.id)}
                    >
                        <Check className="h-4 w-4 mr-1" /> Aprovar
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
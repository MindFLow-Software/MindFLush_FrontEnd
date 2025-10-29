"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deletePatients } from "@/api/delete-patients"

interface DeletePatientProps {
    patientId: string
    fullName: string
    onClose: () => void
}

export function DeletePatientDialog({ patientId, fullName, onClose }: DeletePatientProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleDelete() {
        try {
            setLoading(true)
            setError(null)
            await deletePatients(patientId)
            alert("Paciente excluído com sucesso!")
            onClose()
        } catch (err: any) {
            setError(err?.response?.data?.message || "Erro ao excluir paciente")
        } finally {
            setLoading(false)
        }
    }

    return (
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Excluir paciente</DialogTitle>
                <DialogDescription>
                    Tem certeza que deseja excluir <strong>{fullName}</strong>?
                    Essa ação é irreversível.
                </DialogDescription>
            </DialogHeader>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <DialogFooter className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                    {loading ? "Excluindo..." : "Confirmar exclusão"}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

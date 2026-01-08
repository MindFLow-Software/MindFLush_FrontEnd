"use client"

import type { GetProfileResponse } from "@/api/get-profile"
import { PsychologistAvatarUpload } from "./psychologist-avatar-upload"

interface PsychologistProfileCardProps {
    psychologist: GetProfileResponse
}

export function PsychologistProfileCard({ psychologist }: PsychologistProfileCardProps) {
    const fullName = `${psychologist.firstName} ${psychologist.lastName}`

    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <PsychologistAvatarUpload
                    currentImage={psychologist.profileImageUrl}
                    fullName={fullName}
                />

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{fullName}</h2>
                        <p className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-1">
                            {psychologist.expertise}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">E-mail</span>
                            <span className="font-medium break-all">{psychologist.email}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">Telefone</span>
                            <span className="font-medium">{psychologist.phoneNumber}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">CPF</span>
                            <span className="font-medium">{psychologist.cpf}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-muted-foreground block text-xs uppercase tracking-wider">CRP</span>
                            <span className="font-medium">{psychologist.crp || "Não informado"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
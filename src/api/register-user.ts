import { api } from "@/lib/axios";
import type { Expertise, PsychologistRole } from "@/types/expertise";
import type { Gender } from "@/types/enum-gender";

export interface RegisterPsychologistBody {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isActive?: boolean;
    dateOfBirth: Date;
    cpf: string;
    role: PsychologistRole;
    gender: Gender;
    expertise: Expertise;
    email?: string;
    password?: string;
    profileImageUrl?: string;
    crp?: string;
}

export async function registerPsychologist(data: RegisterPsychologistBody) {
    const response = await api.post('/psychologist', data);
    return response.data;
}

import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty"
import { ArrowUpRightIcon, UserRoundPlus } from "lucide-react"
import { Helmet } from "react-helmet-async"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { RegisterPatients } from "./components/register-patients"

export function NewPatients() {
    return (
        <>
            <Helmet title="Cadastro de Pacientes" />

            <Empty>
                <EmptyHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <UserRoundPlus className="w-6 h-6 text-primary" />
                    </div>

                    <EmptyDescription className="max-w-md text-balance">
                        Cadastre um novo paciente para iniciar os atendimentos e começar a gerenciar o histórico médico.
                    </EmptyDescription>
                </EmptyHeader>

                <EmptyContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="lg" className="gap-2">
                                <UserRoundPlus className="w-4 h-4" />
                                Cadastrar paciente
                            </Button>
                        </DialogTrigger>
                        <RegisterPatients />
                    </Dialog>
                </EmptyContent>

                <Button variant="link" asChild className="text-muted-foreground gap-1" size="sm">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        Saiba mais <ArrowUpRightIcon className="w-3 h-3" />
                    </a>
                </Button>
            </Empty>
        </>
    )
}

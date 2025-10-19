import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { CloudDownload } from "lucide-react"

export function RegisterPatients() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Novo Paciente</DialogTitle>
                <DialogDescription>
                    Preencha os dados para cadastrar um novo paciente
                </DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Nome completo</Label>
                        <Input id="name" className="mt-2" placeholder="Ex: Mariana Silva" />
                    </div>

                    <div>
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" className="mt-2" placeholder="000.000.000-00" />
                    </div>

                    <div>
                        <Label htmlFor="birthDate">Data de Nascimento</Label>
                        <Input id="birthDate" className="mt-2" type="date" />
                    </div>

                    <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" className="mt-2" placeholder="(11) 99999-9999" />
                    </div>

                    <div>
                        <Label htmlFor="gender">Gênero</Label>
                        <Select>
                            <SelectTrigger className="mt-2" >
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="feminino">Feminino</SelectItem>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="cep">CEP</Label>
                        <Input id="cep" className="mt-2" placeholder="00000-000" />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="address">Endereço</Label>
                        <Input id="address" className="mt-2" placeholder="Rua, número, bairro, cidade" />
                    </div>
                </div>

                <div>
                    <Empty className="border border-accent-foreground">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CloudDownload />
                            </EmptyMedia>
                            <EmptyTitle>Sem Documentos</EmptyTitle>
                            <EmptyDescription>
                                Faça o upload dos documentos do paciente para acessá-los facilmente.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" className="cursor-pointer" size="sm">
                                Upload de Documentos
                            </Button>
                        </EmptyContent>
                    </Empty>
                </div>

                <div className="pt-4">
                    <Button type="submit" className="w-full cursor-pointer">
                        Cadastrar paciente
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}

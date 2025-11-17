import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PatientsDetails() {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Paciente: Mariana Silva
                </DialogTitle>
                <DialogDescription>
                    Detalhes do paciente e histórico de sessões
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Status</TableCell>
                            <TableCell className="flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                                    <span className="font-medium text-muted-foreground">
                                        Sessão pendente
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Nome completo</TableCell>
                            <TableCell className="flex justify-end">
                                Mariana Silva
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">CPF</TableCell>
                            <TableCell className="flex justify-end">
                                123.456.789-00
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end">
                                mariana.silva@gmail.com
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end">
                                (11) 99876-5432
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Tema da Sessão</TableHead>
                            <TableHead className="text-right">Duração</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        <TableRow>
                            <TableCell>10/10/2025</TableCell>
                            <TableCell>Ansiedade e rotina</TableCell>
                            <TableCell className="text-right">50 min</TableCell>
                            <TableCell className="text-right text-yellow-500">Pendente</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>03/10/2025</TableCell>
                            <TableCell>Autoestima e autoconfiança</TableCell>
                            <TableCell className="text-right">55 min</TableCell>
                            <TableCell className="text-right text-green-500">Concluída</TableCell>
                        </TableRow>
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total de sessões</TableCell>
                            <TableCell className="text-right font-medium">2</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DialogContent>
    )
}

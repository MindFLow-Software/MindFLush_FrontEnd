import { Search, UserPen, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { PatientsDetails } from './patients-details'

// interface PatitentsTableRow {}

export function PatientsTableRow() {
    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do paciente</span>
                        </Button>
                    </DialogTrigger>
                    <PatientsDetails />
                </Dialog>
            </TableCell>

            <TableCell className="font-medium">12332112333</TableCell>
            <TableCell className="font-medium">Paulo Octavio de OliveiraStraforini</TableCell>
            <TableCell className="text-muted-foreground"> 06/09/2004 </TableCell>
            <TableCell className="text-muted-foreground">em 2 dias</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span className="font-medium text-muted-foreground">Em acompanhamento</span>
                </div>
            </TableCell>
            <TableCell>
                <Button variant="outline" size="xs">
                    <UserPen className="mr-2 h-3 w-3" />
                    Editar
                </Button>
            </TableCell>
            <TableCell>
                <Button variant="ghost" size="xs">
                    <X className="mr-2 h-3 w-3" />
                    Excluir
                </Button>
            </TableCell>
        </TableRow>
    )
}
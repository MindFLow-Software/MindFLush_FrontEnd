"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

interface PatientsTableLoadingProps {
    rows?: number
}

export function PatientsTableLoading({ rows = 10 }: PatientsTableLoadingProps) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                        <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[120px]" />
                                <Skeleton className="h-3 w-[80px]" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-[100px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-[140px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-[80px]" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-3 w-[60px]" />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                        <div className="flex justify-end">
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
}

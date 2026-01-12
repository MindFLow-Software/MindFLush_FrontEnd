"use client"

import { useRef, memo } from "react"
import { CloudUpload, FileText, Paperclip, X, ImageIcon, File as FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FieldSet } from "@/components/ui/field"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from "@/components/ui/empty"

interface SuggestionAttachmentsProps {
    files: File[]
    onFileChange: (files: File[]) => void
}

const getFileIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="h-4 w-4 text-emerald-600" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-500" />
    return <FileIcon className="h-4 w-4 text-muted-foreground/70" />
}

export const SuggestionAttachments = memo(({ files, onFileChange }: SuggestionAttachmentsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const triggerFileInput = () => fileInputRef.current?.click()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            onFileChange([...files, ...newFiles])
        }
        if (e.target) e.target.value = ""
    }

    const handleRemoveFile = (indexToRemove: number) => {
        onFileChange(files.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="pt-4 border-t mt-2">
            <div className="flex items-center justify-between mb-3 px-1">
                <Label className="block font-medium text-[#27187E]">
                    Anexos da Sugestão (Opcional)
                </Label>

                {files.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={triggerFileInput}
                        className="h-8 text-xs cursor-pointer border-[#27187E]/20 text-[#27187E] hover:bg-[#27187E]/5"
                    >
                        <Paperclip className="w-3 h-3 mr-2" />
                        Adicionar
                    </Button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
            />

            <FieldSet className="border-none p-0 shadow-none">
                {files.length === 0 ? (
                    <Empty
                        className="border-2 border-dashed border-[#27187E]/20 py-8 mt-1 hover:bg-[#27187E]/5 transition-colors cursor-pointer rounded-xl"
                        onClick={triggerFileInput}
                    >
                        <EmptyHeader>
                            <EmptyMedia>
                                <div className="p-3 rounded-full bg-[#27187E]/5">
                                    <CloudUpload className="h-8 w-8 text-[#27187E]/60" />
                                </div>
                            </EmptyMedia>
                            <EmptyTitle className="text-base font-medium text-foreground text-center">
                                Nenhum print ou documento
                            </EmptyTitle>
                            <EmptyDescription className="text-sm text-center">
                                Clique aqui para anexar arquivos que ilustrem sua ideia
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="cursor-pointer border-[#27187E]/30 text-[#27187E]"
                            >
                                Selecionar Arquivos
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <div className="grid gap-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
                        {files.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="group flex items-center justify-between p-2 rounded-xl border border-transparent hover:bg-[#27187E]/5 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center border shrink-0">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[12px] font-medium text-foreground/80 truncate max-w-[180px]">
                                            {file.name}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground/60">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => handleRemoveFile(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </FieldSet>
        </div>
    )
})
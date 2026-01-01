"use client"

import { useState, useMemo } from "react"
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Appointment } from "@/api/get-appointment"
import { cn } from "@/lib/utils"

const locales = {
    "pt-BR": ptBR,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    resource: Appointment
}

interface CalendarViewProps {
    appointments: Appointment[]
    onSelectSlot: (date: Date) => void
    onSelectEvent: (appointment: Appointment) => void
}

const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate("PREV")
    const goToNext = () => toolbar.onNavigate("NEXT")
    const goToToday = () => toolbar.onNavigate("TODAY")

    const label = () => {
        return (
            <span className="text-xl font-medium text-gray-800 dark:text-gray-100 capitalize ml-2">
                {format(toolbar.date, "MMMM yyyy", { locale: ptBR })}
            </span>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-1 gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        onClick={goToToday}
                        className="h-9 px-4 text-sm font-medium rounded-md mr-2 border-gray-200 dark:border-gray-700"
                    >
                        Hoje
                    </Button>
                    <div className="flex gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToBack}
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={goToNext}
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </Button>
                    </div>
                </div>
                {label()}
            </div>

            <div className="flex items-center">
                <Select
                    value={toolbar.view}
                    onValueChange={(v) => toolbar.onView(v)}
                >
                    <SelectTrigger className="w-[110px] h-9 text-sm bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-800 focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                        <SelectItem value="month">Mês</SelectItem>
                        <SelectItem value="week">Semana</SelectItem>
                        <SelectItem value="day">Dia</SelectItem>
                        <SelectItem value="agenda">Agenda</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    return (
        <div className="h-full w-full px-1.5 py-0.5 flex flex-col overflow-hidden leading-tight hover:brightness-95 transition-all">
            <span className="font-semibold text-[11px] truncate">{event.title}</span>
            <span className="text-[10px] opacity-90 truncate">
                {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
            </span>
        </div>
    )
}

export function CalendarView({ appointments, onSelectSlot, onSelectEvent }: CalendarViewProps) {
    const [view, setView] = useState<View>(Views.WEEK)
    const [date, setDate] = useState(new Date())

    const events = useMemo((): CalendarEvent[] => {
        return appointments.map((apt) => {
            const startDate = new Date(apt.scheduledAt)
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

            // ✅ CORREÇÃO: Usando Optional Chaining (?.) e fallback de texto
            const patientName = apt.patient
                ? `${apt.patient.firstName} ${apt.patient.lastName}`
                : "Paciente Indisponível"

            return {
                id: apt.id,
                title: patientName,
                start: startDate,
                end: endDate,
                resource: apt,
            }
        })
    }, [appointments])

    return (
        <div className="h-[calc(100vh-140px)] bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 calendar-wrapper">
            <Calendar
                localizer={localizer}
                events={events}
                date={date}
                onNavigate={setDate}
                view={view}
                onView={setView}
                culture="pt-BR"
                components={{
                    toolbar: CustomToolbar,
                    event: CustomEvent,
                }}
                step={30}
                timeslots={2}
                selectable
                onSelectSlot={({ start }) => onSelectSlot(start)}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                dayPropGetter={(date) => {
                    const isToday = new Date().toDateString() === date.toDateString();
                    return {
                        className: cn(
                            "bg-white dark:bg-zinc-950 transition-colors cursor-pointer",
                            isToday ? "bg-blue-50/30 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-zinc-900"
                        )
                    }
                }}
                eventPropGetter={(event) => {
                    let backgroundColor = "#039be5"
                    let borderLeft = "4px solid #0277bd"

                    switch (event.resource.status) {
                        case 'SCHEDULED':
                            backgroundColor = "#039be5"
                            borderLeft = "4px solid #0277bd"
                            break;
                        case 'ATTENDING':
                            backgroundColor = "#f6bf26"
                            borderLeft = "4px solid #f09300"
                            break;
                        case 'FINISHED':
                            backgroundColor = "#33b679"
                            borderLeft = "4px solid #0b8043"
                            break;
                        case 'CANCELED':
                            backgroundColor = "#d50000"
                            borderLeft = "4px solid #b71c1c"
                            break;
                        case 'NOT_ATTEND':
                            backgroundColor = "#616161"
                            borderLeft = "4px solid #202124"
                            break;
                    }

                    return {
                        style: {
                            backgroundColor,
                            border: "none",
                            borderLeft: borderLeft,
                            borderRadius: "4px",
                            color: "white",
                            fontSize: "12px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
                            paddingLeft: "4px"
                        }
                    }
                }}
            />
        </div>
    )
}
import { Helmet } from 'react-helmet-async'
import { MonthRevenueCard } from './month-revenue-card'
import { MonthPatientsAmountCard } from './month-patients-amount-card'
import { PatientsAmountCard } from './patients-amount-card'
import { DaySessionsAmountCard } from './day-sessions-amount-card'
import { SessionsChart } from './sessions-chart'
import { PatientsByAgeChart } from './patients-by-age-chart'
import { PatientsByGenderChart } from './patients-by-gender-chart'
import { DateRangePicker } from './date-range-picker'
import { NewPatientsChart } from './new-patients-chart'

export function Dashboard() {
  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DateRangePicker onChange={(range) => console.log("Período:", range)} />

        <div className="grid grid-cols-4 gap-4">
          <MonthRevenueCard />
          <PatientsAmountCard />
          <MonthPatientsAmountCard />
          <DaySessionsAmountCard />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <SessionsChart />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <PatientsByAgeChart />
        <PatientsByGenderChart />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <NewPatientsChart />
      </div>
    </>
  )
}
 import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import FinancialInsights from '../components/ui/FinancialInsights'
import InvestmentCard from '../components/ui/InvestmentCard'
import PortfolioChart from '../components/ui/PortfolioChart'
import GoalCard from '../components/ui/GoalCard'
import PortfolioAnalysis from '../components/ui/PortfolioAnalysis'
import FinancialAdvisor from '../components/ui/FinancialAdvisor'
import RealMarketCard from '../components/ui/RealMarketCard'
import Profile from './Profile'

export default function Home() {

  const [investments, setInvestments] = useState([])

  const fetchInvestments = async () => {

        const user =
          await supabase.auth.getUser()

        const { data, error } =
          await supabase
            .from('investments')
            .select('*')
            .eq(
              'user_id',
              user.data.user.id
            )

          if (error) {
            console.log(error)
            return
    }

    setInvestments(data)
  }

  useEffect(() => {
    fetchInvestments()
  }, [])

  const total = investments.reduce(
    (acc, investment) =>
      acc + Number(investment.amount),
    0
  )

  const usdTotal = investments
    .filter(
      (investment) =>
        investment.currency === 'USD'
    )
    .reduce(
      (acc, investment) =>
        acc + Number(investment.amount),
      0
    )

  const arsTotal = investments
  .filter(
    (investment) =>
      investment.currency === 'ARS'
  )
  .reduce(
    (acc, investment) =>
      acc + Number(investment.amount),
    0
  )

const emergencyGoal = 10000

const currentSavings = total

const monthlySavings = 500

  return (

    <div className="p-6">

       <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          Dashboard Financiero
        </h1>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
          }}
          className="
            bg-red-500
            hover:bg-red-600
            px-5
            py-3
            rounded-2xl
            font-semibold
          "
        >
          Logout
        </button>

      </div>
      
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <RealMarketCard symbol="VOO" />

        <RealMarketCard symbol="SPY" />

        <RealMarketCard symbol="BINANCE:BTCUSDT" />

        <RealMarketCard symbol="YPF" />

      </div>

      <div
        className="
          bg-slate-800
          rounded-3xl
          p-6
          mb-6
        "
      >

        <p className="text-slate-400">
          Patrimonio Total
        </p>

        <h2 className="text-5xl font-bold mt-2">
          ${total}
        </h2>

        <p className="text-green-400 mt-3">
          {investments.length} inversiones activas
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div
          className="
            bg-slate-800
            p-5
            rounded-3xl
          "
        >

          <p className="text-slate-400">
            Total USD
          </p>

          <h3 className="text-3xl font-bold mt-2">
            ${usdTotal}
          </h3>

        </div>

        <div
          className="
            bg-slate-800
            p-5
            rounded-3xl
          "
        >

          <p className="text-slate-400">
            Total ARS
          </p>

          <h3 className="text-3xl font-bold mt-2">
            ${arsTotal}
          </h3>

        </div>

      </div>
      
      <Profile />

      <div className="mb-6">
        <PortfolioChart investments={investments} />
      </div>
      <div className="mb-6">

  <PortfolioAnalysis
    investments={investments}
  />

</div>

<div className="mb-6">

  <FinancialAdvisor
    investments={investments}
  />

</div>

<div className="mb-6">

  <FinancialInsights
    investments={investments}
  />

</div>
      <div className="mb-6">

  <GoalCard
    title="Fondo de Emergencia"
    current={currentSavings}
    target={emergencyGoal}
  />

</div>
<div
  className="
    bg-slate-800
    rounded-3xl
    p-6
    mb-6
  "
>

  <p className="text-slate-400">
    Ahorro Mensual
  </p>

  <h2 className="text-4xl font-bold mt-2">
    ${monthlySavings}
  </h2>

</div>

      <div className="grid gap-4">

        {investments.map((investment) => (

          <InvestmentCard
            key={investment.id}
            id={investment.id}
            title={investment.title}
            value={`${investment.amount} ${investment.currency}`}
            category={investment.category}
            color="#4ade80"
            refreshInvestments={fetchInvestments}
          />

        ))}

      </div>

    </div>
  )
}
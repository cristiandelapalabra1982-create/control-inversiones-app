 import { useEffect, useState } from 'react'

import { getDollarRate }
from '../services/dollarApi'
import { supabase } from '../lib/supabase'
import RealMarketCard from '../components/ui/RealMarketCard'
import PortfolioChart from '../components/ui/PortfolioChart'
import InvestmentCard from '../components/ui/InvestmentCard'
import AddInvestment from './AddInvestment'

export default function Home() {

const demoInvestments = [
  {
    id: 1,
    title: 'VOO',
    amount: 1000,
    currency: 'USD',
    category: 'ETF'
  },
  {
    id: 2,
    title: 'BTC',
    amount: 500,
    currency: 'USD',
    category: 'Cripto'
  }
]

  const [investments, setInvestments] =
    useState(demoInvestments)

  const [dollarRate, setDollarRate] =
    useState(1300)
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

    if (data && data.length > 0) {
      setInvestments(data)
}
  }


  useEffect(() => {

    fetchInvestments()

    async function fetchDollar() {

      const rate =
        await getDollarRate()

      setDollarRate(rate)
  }

  fetchDollar()

}, [])


  const total = investments.reduce(
    (acc, investment) => {

      if (investment.currency === 'ARS') {
        return acc +
          Number(investment.amount) /
          dollarRate
      }

      return acc +
        Number(investment.amount)

  },
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
  return (

    <div className="p-10 text-white">

      <h1 className="text-4xl font-bold mb-6">
        Dashboard Financiero
      </h1>

      <div className="mb-6">

    <AddInvestment
      refreshInvestments={fetchInvestments}
    />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <RealMarketCard symbol="VOO" />

        <RealMarketCard symbol="SPY" />

        <RealMarketCard symbol="BINANCE:BTCUSDT" />

      </div>

      <div
        className="
         bg-slate-800
          rounded-3xl
          p-6
          mb-6
          shadow-lg
        "
      >

        <p className="text-slate-400">
          Patrimonio Total
        </p>

        <h2 className="text-5xl font-bold mt-2">

          USD {total.toFixed(2)}

        </h2>

        <p className="text-slate-400 mt-3">

          ARS {arsTotal.toLocaleString()}

        </p>

        <p className="text-slate-500 mt-1">

          Dólar Blue: {dollarRate}

        </p>

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
            shadow-lg
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
            shadow-lg
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

      <PortfolioChart
        investments={investments}
      />

      <div className="mt-6">

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
import { useEffect, useState } from 'react'

import { getDollarRates }
from '../services/dollarApi'
import { supabase } from '../lib/supabase'
import RealMarketCard from '../components/ui/RealMarketCard'
import PortfolioChart from '../components/ui/PortfolioChart'
import PortfolioHistoryChart
from '../components/ui/PortfolioHistoryChart'
import InvestmentCard from '../components/ui/InvestmentCard'
import AddInvestment from './AddInvestment'

export default function Home() {

  const [investments, setInvestments] =
    useState([])

  const [dollarRates, setDollarRates] =
    useState({

      mep: 1200,
      blue: 1300,
      oficial: 1000

    })

  const [marketValues, setMarketValues] =
    useState({})
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

      const rates =
        await getDollarRates()

      setDollarRates(rates)
    }

    async function savePortfolioSnapshot() {

      const user =
        await supabase.auth.getUser()

      if (!user.data.user) return

      const totalProfit = investments.reduce(
        (acc, investment) => {

          const quantity =
            Number(investment.quantity || 0)

          const purchase =
            Number(investment.purchase_price || 0)

          const amount =
            Number(investment.amount || 0)

          return acc +
            (amount - purchase) * quantity

        },
        0
      )

      await supabase
        .from('portfolio_history')
        .insert({

          user_id:
            user.data.user.id,

          total_value: total,

          total_profit: totalProfit
        })
    }

    fetchDollar()

    if (investments.length > 0) {

      savePortfolioSnapshot()
    }
    async function fetchMarketPrices() {

      const values = {}

      for (const investment of investments) {

        if (
          investment.currency === 'USD'
        ) {

          const quote =
            await getQuote(
              investment.title
            )

          values[investment.title] =
            quote.price || 0
        }

      }

      setMarketValues(values)

    }

    fetchMarketPrices()
    
  }, [investments])

    const total = investments.reduce(
      (acc, investment) => {

      const marketPrice =
        marketValues[
          investment.title
        ] || 0

      const quantity =
        Number(investment.quantity || 0)

      if (
        investment.currency === 'ARS'
      ) {

        return (
          acc +
          (
          Number(investment.amount) /
          dollarRates.mep
          )
        )
      }

      if (quantity > 0) {

        return (
          acc +
          marketPrice * quantity
        )
      }

      return (
        acc +
        Number(investment.amount)
      )

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
  const totalPurchaseValue =
    investments.reduce(
      (acc, investment) => {

        let purchaseValue =
          Number(
            investment.purchase_price || 0
          ) *
          Number(
            investment.quantity || 0
          )

        if (
          investment.currency === 'ARS'
        ) {
          purchaseValue =
            purchaseValue / dollarRates.mep
        }

        return acc + purchaseValue

      },
      0
    )

  const totalCurrentValue =
    investments.reduce(
      (acc, investment) => {

        let currentValue =
          Number(investment.amount || 0)

        if (
          investment.currency === 'ARS'
          ) {
          currentValue =
            currentValue / dollarRates.mep
        }

        return acc + currentValue

      },
      0
    )

  const totalProfit =
    totalCurrentValue -
    totalPurchaseValue

  const totalProfitPercent =
    totalPurchaseValue > 0
      ? (
          (
            totalProfit /
            totalPurchaseValue
          ) * 100
        )
      : 0

    return (

    <div className="p-10 text-white">

      <div
        className="
          flex
          flex-col
          md:flex-row
          justify-between
          md:items-center
          gap-4
          mb-6
        "
      >

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

        <div className="mt-3 space-y-1">

          <p className="text-slate-400">

            Dólar MEP:
            {' '}
            {dollarRates.mep}

          </p>

        <p className="text-slate-400">

            Dólar Blue:
            {' '}
            {dollarRates.blue}

        </p>

        <p className="text-slate-400">

            Dólar Oficial:
            {' '}
          {dollarRates.oficial}

        </p>

      </div>

        <p className="text-green-400 mt-3">
          {investments.length} inversiones activas
        </p>

        <p
          className={`
            mt-3
            text-xl
            font-bold
            ${
              totalProfit >= 0
              ? 'text-green-400'
              : 'text-red-400'
            }
          `}
        >

          {totalProfit >= 0 ? '+' : ''}

          USD
          {' '}
          {totalProfit.toFixed(2)}

          {' '}
          (
          {totalProfitPercent.toFixed(2)}
          %)

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
            ${usdTotal.toLocaleString()}
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
            ${arsTotal.toLocaleString()}
          </h3>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">

        <PortfolioChart
          title="Portfolio USD"
          investments={
            investments.filter(
              (investment) =>
                investment.currency === 'USD'
            )
          }
        />

        <PortfolioChart
          title="Portfolio ARS"
          investments={
            investments.filter(
              (investment) =>
                investment.currency === 'ARS'
            )
          }
        />

      </div>

      <div className="mb-6">

        <PortfolioHistoryChart />

      </div>

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
            purchasePrice={
              investment.purchase_price
            }

            quantity={
              investment.quantity
            }
          />

        ))}

      </div>
      
    </div>
      
  )

}
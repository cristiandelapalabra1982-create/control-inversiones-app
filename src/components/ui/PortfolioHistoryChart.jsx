import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../../lib/supabase'

export default function PortfolioHistoryChart() {

  const [data, setData] =
    useState([])

  useEffect(() => {

    async function fetchHistory() {

      const user =
        await supabase.auth.getUser()

      if (!user.data.user) return

      const { data, error } =
        await supabase
          .from('portfolio_history')
          .select('*')
          .eq(
            'user_id',
            user.data.user.id
          )
          .order(
            'created_at',
            { ascending: true }
          )

      if (error) {

        console.log(error)
        return
      }

      const formatted =
        data.map((item) => ({

          day:
            new Date(
              item.created_at
            ).toLocaleDateString(),

          value:
            Number(
              item.total_value || 0
            )

        }))

      setData(formatted)

    }

    fetchHistory()

  }, [])

  return (

    <div
      className="
        bg-slate-800
        rounded-3xl
        p-6
        shadow-lg
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        Evolución Portfolio
      </h2>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart data={data}>

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4ade80"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  )

}
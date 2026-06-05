import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function PortfolioChart({
  investments,
  title
}) {

  const data = investments.map(
    (investment) => ({
      name: investment.title,
      value: Number(investment.amount)
    })
  )

  const COLORS = [
    '#4ade80',
    '#60a5fa',
    '#f472b6',
    '#facc15',
    '#c084fc',
    '#fb923c'
  ]

  return (

    <div
      className="
        bg-slate-800
        rounded-3xl
        p-6
        h-[400px]
      "
    >

      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />

            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  )
}

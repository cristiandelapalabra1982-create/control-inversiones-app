export default function FinancialInsights({
  investments
}) {

  const total = investments.reduce(
    (acc, inv) =>
      acc + Number(inv.amount),
    0
  )

  const cryptoTotal = investments
    .filter(
      (inv) =>
        inv.category === 'Cripto'
    )
    .reduce(
      (acc, inv) =>
        acc + Number(inv.amount),
      0
    )

  const cryptoPercent =
    total > 0
      ? ((cryptoTotal / total) * 100)
          .toFixed(0)
      : 0

  return (

    <div
      className="
        bg-slate-800
        p-6
        rounded-3xl
        mb-6
      "
    >

      <h2 className="text-2xl font-bold mb-4">
        IA Financiera
      </h2>

      <div className="grid gap-4">

        {cryptoPercent > 40 && (

          <div
            className="
              bg-red-500/20
              border
              border-red-500
              p-4
              rounded-2xl
            "
          >

            <p className="font-semibold">
              Riesgo Alto
            </p>

            <p className="text-sm text-slate-300 mt-2">
              Tu portfolio tiene
              mucha exposición a cripto.
            </p>

          </div>

        )}

        {cryptoPercent <= 40 && (

          <div
            className="
              bg-green-500/20
              border
              border-green-500
              p-4
              rounded-2xl
            "
          >

            <p className="font-semibold">
              Portfolio Balanceado
            </p>

            <p className="text-sm text-slate-300 mt-2">
              Tu exposición a cripto
              parece saludable.
            </p>

          </div>

        )}

      </div>

    </div>
  )
}
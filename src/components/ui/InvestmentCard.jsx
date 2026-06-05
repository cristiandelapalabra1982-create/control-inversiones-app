 import { useEffect, useState } from 'react'
import { getQuote } from '../../services/marketApi'
import { supabase } from '../../lib/supabase'

export default function InvestmentCard({
  id,
  title,
  value,
  category,
  color,
  refreshInvestments,
  purchasePrice,
  quantity
}) {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    async function fetchQuote() {
      const data = await getQuote(title)
      setQuote(data)
    }
    fetchQuote()
  }, [title])

  const currentPrice = quote?.price || 0
  const totalCurrentValue = currentPrice * Number(quantity || 0)
  const totalPurchaseValue = Number(purchasePrice || 0) * Number(quantity || 0)
  const profit = totalCurrentValue - totalPurchaseValue
  const profitPercent =
    totalPurchaseValue > 0 ? (profit / totalPurchaseValue) * 100 : 0

  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const [newValue, setNewValue] = useState(value.split(' ')[0])
  const [newCurrency, setNewCurrency] = useState(value.split(' ')[1])

  async function handleDelete() {
    const confirmDelete = confirm('¿Eliminar inversión?')
    if (!confirmDelete) return

    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error al eliminar')
      console.log(error)
      return
    }

    alert('Inversión eliminada')
    refreshInvestments()
  }

  async function handleUpdate() {
    const { error } = await supabase
      .from('investments')
      .update({
        title: newTitle,
        amount: newValue,
        currency: newCurrency
      })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar')
      console.log(error)
      return
    }

    alert('Inversión actualizada')
    setEditing(false)
    refreshInvestments()
  }

  return (
    <div className="bg-slate-800 rounded-3xl p-5 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
      {!editing ? (
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-slate-300 mt-1">{value}</p>
            <p className="text-slate-500 text-sm">Cantidad: {quantity || 0}</p>
            <p className="text-slate-500 text-sm">Compra: ${purchasePrice || 0}</p>

            {quote && quantity > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-slate-400 text-sm">
                  Precio actual: ${currentPrice.toFixed(2)}
                </p>
                <p className="text-slate-400 text-sm">
                  Valor actual: ${totalCurrentValue.toFixed(2)}
                </p>
                <p className={`text-sm font-semibold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                </p>
              </div>
            )}

            <p className="inline-block bg-slate-700 px-3 py-1 rounded-full text-sm mt-2">
              {category}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="bg-slate-700 p-3 rounded-xl"
          />
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="bg-slate-700 p-3 rounded-xl"
          />
          <input
            type="text"
            value={newCurrency}
            onChange={(e) => setNewCurrency(e.target.value)}
            className="bg-slate-700 p-3 rounded-xl"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
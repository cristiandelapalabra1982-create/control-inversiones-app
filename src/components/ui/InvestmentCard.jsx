 import { useState } from 'react'

import { supabase } from '../../lib/supabase'

export default function InvestmentCard({
  id,
  title,
  value,
  category,
  color,
  refreshInvestments
}) {

  const [editing, setEditing] = useState(false)

  const [newTitle, setNewTitle] = useState(title)

  const [newValue, setNewValue] = useState(
    value.split(' ')[0]
  )

  const [newCurrency, setNewCurrency] = useState(
    value.split(' ')[1]
  )

  async function handleDelete() {

    const confirmDelete = confirm(
      '¿Eliminar inversión?'
    )

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

    <div
      className="
        bg-slate-800
        rounded-3xl
        p-5
        shadow-lg
        hover:scale-105
        hover:shadow-2xl
        transition-all
        duration-300
      "
    >

      {!editing ? (

        <div className="flex justify-between items-center">

          <div>

            <h3 className="text-xl font-semibold">
              {title}
            </h3>

            <p className="text-slate-300 mt-1">
              {value}
            </p>
            <p
              className="
                inline-block
                bg-slate-700
                px-3
                py-1
                rounded-full
                text-sm
                mt-2
              "
            >
              {category}
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() => setEditing(true)}
              className="
                bg-blue-500
                hover:bg-blue-600
                px-4
                py-2
                rounded-xl
              "
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              className="
                bg-red-500
                hover:bg-red-600
                px-4
                py-2
                rounded-xl
              "
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
            onChange={(e) =>
              setNewTitle(e.target.value)
            }
            className="
              bg-slate-700
              p-3
              rounded-xl
            "
          />

          <input
            type="number"
            value={newValue}
            onChange={(e) =>
              setNewValue(e.target.value)
            }
            className="
              bg-slate-700
              p-3
              rounded-xl
            "
          />

          <input
            type="text"
            value={newCurrency}
            onChange={(e) =>
              setNewCurrency(e.target.value)
            }
            className="
              bg-slate-700
              p-3
              rounded-xl
            "
          />

          <div className="flex gap-2">

            <button
              onClick={handleUpdate}
              className="
                bg-green-500
                hover:bg-green-600
                px-4
                py-2
                rounded-xl
              "
            >
              Guardar
            </button>

            <button
              onClick={() => setEditing(false)}
              className="
                bg-slate-600
                hover:bg-slate-700
                px-4
                py-2
                rounded-xl
              "
            >
              Cancelar
            </button>

          </div>

        </div>

      )}

    </div>
  )
}
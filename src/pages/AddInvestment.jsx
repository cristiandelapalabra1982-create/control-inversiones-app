import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddInvestment({
  refreshInvestments
}) {

  const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('')
  const [platform, setPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [purchasePrice, setPurchasePrice] =
    useState('')
  const [quantity, setQuantity] =
    useState('')

  async function handleSubmit(e) {

    e.preventDefault()

    const { error } = await supabase
      .from('investments')
      .insert([
       {
        title,
        amount,
        currency,
        platform,
        category,
        quantity: quantity,
        purchase_price: purchasePrice,
        user_id:
          (
            await supabase.auth.getUser()
          ).data.user.id
      }
       ])

    if (error) {
      alert('Error al guardar')
      console.log(error)
      return
    }

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 3000)

    refreshInvestments()

    setTitle('')
    setAmount('')
    setCurrency('')
    setPlatform('')
    setCategory('')
  }

  return (

    <div>

      <h1 className="text-3xl font-bold mb-6">
        Nueva Inversión
      </h1>

      {success && (

        <div
          className="
            bg-green-500
            text-white
            p-4
            rounded-2xl
            mb-4
            shadow-lg
          "
        >
          Inversión guardada 🚀
        </div>

)}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4"
      >

        <input
          type="text"
          placeholder="Nombre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-800 p-4 rounded-xl"
        />

        <input
          type="number"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-slate-800 p-4 rounded-xl"
        />
        <input
          type="number"
          placeholder="Precio de compra"
          value={purchasePrice}
          onChange={(e) =>
          setPurchasePrice(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-slate-800
          mt-4
        "
      />
        <input
          type="number"
          placeholder="Cantidad"
          value={quantity}
          onChange={(e) =>
          setQuantity(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-slate-800
          mt-4
        "
      />

        <input
          type="text"
          placeholder="Moneda"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-slate-800 p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Plataforma"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="bg-slate-800 p-4 rounded-xl"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-800 p-4 rounded-xl"
        >

          <option value="">
            Categoría
          </option>

          <option value="ETF">
            ETF
          </option>

          <option value="Acción">
            Acción
          </option>

          <option value="Cripto">
            Cripto
          </option>

          <option value="Fondo">
            Fondo
          </option>

          <option value="Cash">
            Cash
          </option>

          <option value="CEDEAR">
            CEDEAR
          </option>

        </select>

        <button
          className="
            bg-green-500
            hover:bg-green-600
            p-4
            rounded-xl
            font-semibold
          "
        >
          Guardar Inversión
        </button>

      </form>

    </div>
  )
}
 import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Profile() {

  const [user, setUser] = useState(null)

  useEffect(() => {

    fetchUser()

  }, [])

  async function fetchUser() {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    setUser(user)
  }

  return (

    <div
      className="
        bg-slate-800
        rounded-3xl
        p-6
        mb-6
      "
    >

      <div className="flex items-center gap-4 mb-6">

        <div
          className="
            w-20
            h-20
            rounded-full
            bg-green-500
            flex
            items-center
            justify-center
            text-3xl
            font-bold
          "
        >
          {user?.email?.charAt(0).toUpperCase()}
        </div>

        <div>

          <h2 className="text-2xl font-bold">
            Perfil Usuario
          </h2>

          <p className="text-slate-400">
            Cuenta activa
          </p>

        </div>

      </div>

      <div className="grid gap-2">

        <p className="text-slate-400">
          Email
        </p>

        <p className="text-xl font-semibold">
          {user?.email}
        </p>

        <p className="text-slate-400 mt-4">
          User ID
        </p>

        <p className="text-sm break-all">
          {user?.id}
        </p>

      </div>

    </div>
  )
}
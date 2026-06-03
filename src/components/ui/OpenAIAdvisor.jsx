import { useState } from 'react'
import { openai } from '../../services/openai.js'
export default function OpenAIAdvisor({
  investments
}) {

  const [loading, setLoading] = useState(false)

  const [response, setResponse] =
    useState('')

  async function analyzePortfolio() {

    setLoading(true)

    const portfolioText =
      investments
        .map(
          (inv) =>
            `${inv.title} -
             ${inv.amount}
             ${inv.currency}
             (${inv.category})`
        )
        .join('\n')

    try {

      const completion =
        await openai.chat.completions.create({

          model: 'gpt-4.1-mini',

          messages: [
            {
              role: 'system',
              content:
                `
                Eres un asesor financiero profesional.
                Analiza portfolios de inversión.
                Habla en español claro.
                `
            },

            {
              role: 'user',
              content:
                `
                Analiza este portfolio:

                ${portfolioText}

                Indica:
                - nivel de riesgo
                - diversificación
                - consejos
                - mejoras posibles
                `
            }
          ]
        })

      setResponse(
        completion.choices[0]
          .message.content
      )

    } catch (error) {

      console.log(error)

      setResponse(
        'Error analizando portfolio'
      )

    }

    setLoading(false)
  }

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
        IA Advisor OpenAI
      </h2>

      <button
        onClick={analyzePortfolio}
        className="
          bg-blue-500
          hover:bg-blue-600
          px-5
          py-3
          rounded-2xl
          font-semibold
        "
      >

        {loading
          ? 'Analizando...'
          : 'Analizar Portfolio'}

      </button>

      {response && (

        <div
          className="
            mt-6
            bg-slate-900
            p-4
            rounded-2xl
            whitespace-pre-wrap
          "
        >

          {response}

        </div>

      )}

    </div>
  )
}
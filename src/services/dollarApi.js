export async function getDollarRates() {

  try {

    const [
      mepResponse,
      blueResponse,
      oficialResponse
    ] = await Promise.all([

      fetch(
        'https://dolarapi.com/v1/dolares/mep'
      ),

      fetch(
        'https://dolarapi.com/v1/dolares/blue'
      ),

      fetch(
        'https://dolarapi.com/v1/dolares/oficial'
      )

    ])

    const mep =
      await mepResponse.json()

    const blue =
      await blueResponse.json()

    const oficial =
      await oficialResponse.json()

    return {

      mep: mep.venta,
      blue: blue.venta,
      oficial: oficial.venta

    }

  } catch (error) {

    console.log(error)

    return {

      mep: 1200,
      blue: 1300,
      oficial: 1000

    }

  }

}

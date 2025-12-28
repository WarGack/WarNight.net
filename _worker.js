export default {
  async fetch(req, env) {
    const u = new URL(req.url)

    if (u.pathname === "/api/create-invoice") {
      const { id, email } = await req.json()

      const price = id == 1 ? 2.99 : id == 2 ? 4.99 : 9.99

      const r = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "REBP4MH-7674DWE-PCDS26J-WEDFK0F"
        },
        body: JSON.stringify({
          price_amount: price,
          price_currency: "usd",
          order_description: `${id}, ${email}`
        })
      })

      return new Response(
        JSON.stringify({ invoice_url: (await r.json()).invoice_url }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    return env.ASSETS.fetch(req)
  }
}

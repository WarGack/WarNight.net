export default {
  async fetch(req, env) {
    const u = new URL(req.url)

    // API
    if (u.pathname === "/api/create-invoice") {
      const { nick } = await req.json()

      const r = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "REBP4MH-7674DWE-PCDS26J-WEDFK0F"
        },
        body: JSON.stringify({
          price_amount: 4.99,
          price_currency: "usd",
          order_description: nick || ""
        })
      })

      return new Response(
        JSON.stringify({ invoice_url: (await r.json()).invoice_url }),
        { headers: { "Content-Type": "application/json" } }
      )
    }

    // Статика (donate.html и всё остальное)
    return env.ASSETS.fetch(req)
  }
}

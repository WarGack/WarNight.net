export default {
  async fetch(req, env) {
    const u = new URL(req.url)

    if (u.pathname === "/api/create-invoice") {
      const { id, qty, email } = await req.json()

      const pid = id|0
      if (pid < 1 || pid > 5) return new Response("bad id", { status: 400 })

      const q = qty|0
      if (q < 1 || q > 99) return new Response("bad qty", { status: 400 })

      const unit =
        pid===1 ? 2.99 :
        pid===2 ? 4.99 :
        pid===3 ? 9.99 :
        pid===4 ? 29.99 :
                 49.99

      const r = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "REBP4MH-7674DWE-PCDS26J-WEDFK0F"
        },
        body: JSON.stringify({
          price_amount: +(unit * q).toFixed(2),
          price_currency: "usd",
          order_description: `${pid} ${q} ${email||""}`
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

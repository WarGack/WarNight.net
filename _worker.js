export default {
  async fetch(req){
    if(req.method==="OPTIONS")
      return new Response("",{headers:{
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Headers":"Content-Type"
      }})

    if(new URL(req.url).pathname!=="/create-invoice")
      return new Response("404")

    const { amount, email } = await req.json()

    const r = await fetch("https://api.nowpayments.io/v1/invoice",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-api-key":"REBP4MH-7674DWE-PCDS26J-WEDFK0F"
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        order_description: email
      })
    })

    return new Response(
      JSON.stringify({ invoice_url:(await r.json()).invoice_url }),
      { headers:{ "Access-Control-Allow-Origin":"*" } }
    )
  }
}

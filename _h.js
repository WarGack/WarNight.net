var p = location.pathname.replace(/\/+$/, "") || "/"
var isHome = p == "/" || p == "/index" || p == "/index.html"
var isDemon = p == "/demonlist" || p == "/demonlist.html"
var isDonate = p == "/donate" || p == "/donate.html" || p.startsWith("/shop")

document.write(
  '<div class="_nav">'
  + '<div class="_logo">WarNight</div>'
  + '<div class="_navLinks">'
  + '<a href="/"' + (isHome ? ' class="_on"' : '') + '>Главная</a>'
  + '<a href="/demonlist"' + (isDemon ? ' class="_on"' : '') + '>Демонлист</a>'
  + '<a href="/donate"' + (isDonate ? ' class="_on"' : '') + '>Донат</a>'
  + '</div>'
  + '</div><hr>'
)

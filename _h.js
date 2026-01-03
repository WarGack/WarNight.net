var p = location.pathname
var d = p.endsWith("/demonlist.html") || p.endsWith("demonlist.html")
var o = p.endsWith("/donate.html") || p.endsWith("donate.html")

document.write(
  '<div class=_nav>'
  +'<a href="/demonlist.html"'+(d?' class=_on':'')+'>Демонлист</a>'
  +'<a href="/donate.html"'+(o?' class=_on':'')+'>Донат</a>'
  +'</div><hr>'
)

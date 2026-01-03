var p = location.pathname.replace(/\/+$/,"") || "/"
var d = p=="/demonlist" || p=="/demonlist.html"
var o = p=="/donate" || p=="/donate.html"

document.write(
  '<div class=_nav>'
  +'<a href="/demonlist"'+(d?' class=_on':'')+'>Демонлист</a>'
  +'<a href="/donate"'+(o?' class=_on':'')+'>Донат</a>'
  +'</div><hr>'
)

const path = (location.pathname.replace(/\/+$/, "") || "/").toLowerCase();
const is = (href) => path === href || path === `${href}.html` || path.startsWith(`${href}/`);
const links = [
  { href: "/", label: "Главная" },
  { href: "/donate", label: "Донат" },
  { href: "/shop/6", label: "Mega Hack v9" },
  { href: "/shop/7", label: "GDH" },
  { href: "/demonlist", label: "Демонлист" }
];

document.write(`
  <div class="topbar">
    <div class="topbar__inner">
      <a class="brand" href="/">
        <span>WN</span>
        WarNight
      </a>
      <div class="nav">
        ${links.map(l => `<a href="${l.href}" class="${is(l.href) ? 'is-active' : ''}">${l.label}</a>`).join('')}
      </div>
    </div>
  </div>
`);

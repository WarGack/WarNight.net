const path = location.pathname.replace(/\/+$/, "") || "/";
const isDonate = path === "/donate" || path === "/donate.html";
const isDemon = path === "/demonlist" || path === "/demonlist.html";
const navLinks = [
  { href: "/donate", label: "Донат", active: isDonate },
  { href: "/demonlist", label: "Демонлист", active: isDemon }
];

document.write(`
  <div class="navbar">
    <div class="navbar__inner">
      <a class="brand" href="/">
        <span class="brand__mark">WN</span>
        <span>WarNight</span>
      </a>
      <div class="navlinks">
        ${navLinks
          .map(l => `<a href="${l.href}"${l.active ? ' class="_on"' : ''}>${l.label}</a>`)
          .join("")}
      </div>
    </div>
  </div>
`);

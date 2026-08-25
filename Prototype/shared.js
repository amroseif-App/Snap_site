// SNAP Saudi — shared nav/lang behavior for static content pages
(function(){
  const $=s=>document.querySelector(s);
  const INTERNAL_PAGES = ["Index.html","about.html","how-we-work.html","leadership.html","clients.html","services.html","saudi-arabia.html","egypt.html","gulf-arab-states.html"];

  function urlLang(){
    const v = new URLSearchParams(location.search).get("lang");
    return (v === "ar" || v === "en") ? v : null;
  }

  // Resolve initial language: URL param wins (so links between pages always carry it),
  // then localStorage (best-effort, may not persist across file:// pages), then default.
  let lang = urlLang() || (function(){ try { return localStorage.getItem("snapLang"); } catch(e){ return null; } })() || "en";

  function isInternalLink(a){
    const href = a.getAttribute("href");
    if(!href) return false;
    if(/^(https?:)?\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
    return INTERNAL_PAGES.some(p => href.indexOf(p) !== -1);
  }

  function decorateLinks(){
    document.querySelectorAll("a[href]").forEach(a=>{
      if(!isInternalLink(a)) return;
      const href = a.getAttribute("href");
      const [pathAndQuery, hash] = href.split("#");
      const [path, query] = pathAndQuery.split("?");
      const params = new URLSearchParams(query || "");
      params.set("lang", lang);
      const newHref = path + "?" + params.toString() + (hash ? "#"+hash : "");
      a.setAttribute("href", newHref);
    });
  }

  function applyLang(){
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("dir", document.documentElement.dir);
    const langBtn = $("#langBtn");
    if(langBtn) langBtn.textContent = lang === "ar" ? "EN" : "AR";
    try { localStorage.setItem("snapLang", lang); } catch(e){}
    decorateLinks();
  }

  document.addEventListener("DOMContentLoaded", function(){
    applyLang();
    const langBtn = $("#langBtn");
    if(langBtn) langBtn.addEventListener("click", function(){
      lang = lang === "en" ? "ar" : "en";
      applyLang();
    });
    const menuBtn = $("#menuBtn");
    const navLinks = $("#navLinks");
    if(menuBtn && navLinks){
      menuBtn.addEventListener("click", ()=>navLinks.classList.toggle("open"));
      navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));
    }
    document.querySelectorAll(".nav-group-trigger").forEach(function(t){
      t.addEventListener("click", function(e){
        e.stopPropagation();
        var g = t.closest(".nav-group"); if(!g) return;
        var open = g.classList.toggle("open");
        t.setAttribute("aria-expanded", open);
      });
    });
    document.addEventListener("click", function(e){
      document.querySelectorAll(".nav-group.open").forEach(function(g){
        if(!g.contains(e.target)){
          g.classList.remove("open");
          var tr = g.querySelector(".nav-group-trigger");
          if(tr) tr.setAttribute("aria-expanded","false");
        }
      });
    });
    // Back-to-top button
    (function(){
      var isAr = document.documentElement.dir === "rtl";
      var btn = document.createElement("button");
      btn.className = "back-to-top"; btn.type = "button";
      btn.setAttribute("aria-label", isAr ? "العودة لأعلى" : "Back to top");
      btn.innerHTML = "↑";
      document.body.appendChild(btn);
      btn.addEventListener("click", function(){ window.scrollTo({top:0,behavior:"smooth"}); });
      window.addEventListener("scroll", function(){ btn.classList.toggle("show", window.scrollY > 600); }, {passive:true});
    })();
  });
})();

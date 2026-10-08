(() => {
  "use strict";

  const WHATSAPP = "233545887048";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const waLink = (text, number = WHATSAPP) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  const openWA = (text) => window.open(waLink(text), "_blank", "noopener");

  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("is-on"), 2200);
  };

  /* ---------------- Mobile nav ---------------- */
  const toggle = $(".nav__toggle");
  const links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("is-open", !open);
  });
  $$("a", links).forEach((a) => a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    links.classList.remove("is-open");
  }));

  /* Highlight current section in nav */
  const navMap = new Map($$("a[href^='#']", links).map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const a = navMap.get(e.target.id);
      if (a && e.isIntersecting) {
        navMap.forEach((x) => x.classList.remove("is-current"));
        a.classList.add("is-current");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------------- Hero video ---------------- */
  const heroVideo = $(".hero__video");
  const soundBtn = $("#hero-sound");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) heroVideo.pause();
  soundBtn.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    if (!heroVideo.muted) heroVideo.play();
    soundBtn.textContent = heroVideo.muted ? "🔇" : "🔊";
    soundBtn.setAttribute("aria-label", heroVideo.muted ? "Unmute video" : "Mute video");
  });

  /* ---------------- Value menu ---------------- */
  const VALUE = {
    1: { name: "Spicy Pork Rice Bowl", tag: "Every Monday", img: "assets/img/value-spicy-pork.jpg",
      desc: "Tender pork stir-fried in a fiery gochujang glaze, served over steamed rice with kimchi on the side." },
    2: { name: "Japchae Rice Bowl", tag: "Every Tuesday", img: "assets/img/value-japchae.jpg",
      desc: "Silky sweet-potato glass noodles tossed with vegetables, egg ribbons and sesame over rice. Bold flavours, fresh ingredients." },
    3: { name: "Bulgogi Rice Bowl", tag: "Every Wednesday", img: "assets/img/value-bulgogi.jpg",
      desc: "Korea's famous marinated beef, grilled with onions and peppers — the perfect midweek lunch." },
    4: { name: "Coming soon…", tag: "Thursday", img: "assets/img/buffet-dinner.jpg", price: null,
      desc: "Our next Value Menu dish is on the way. Follow @korea_house_ninano to be the first to know — and guess the dish!" },
    5: { name: "Tteokbokki Noodle Bowl", tag: "Every Friday · New!", img: "assets/img/value-menu-tteokbokki.jpg",
      desc: "Spicy, chewy, delicious. Rice cakes, fish cake and noodles in a sweet-hot red sauce, topped with a soft-boiled egg. Launching Friday 9th October." },
  };
  const dayBtns = $$(".days button");
  let currentDay = 1;

  const showDay = (d) => {
    currentDay = d;
    const v = VALUE[d];
    dayBtns.forEach((b) => b.setAttribute("aria-selected", String(+b.dataset.day === d)));
    const img = $("#value-img");
    img.classList.add("is-swapping");
    setTimeout(() => {
      img.src = v.img;
      img.alt = v.name;
      img.onload = () => img.classList.remove("is-swapping");
      if (img.complete) img.classList.remove("is-swapping");
    }, 150);
    $("#value-name").textContent = v.name;
    $("#value-tag").textContent = v.tag;
    $("#value-desc").textContent = v.desc;
    const hasPrice = v.price !== null;
    $(".price").hidden = !hasPrice;
    $("#value-order").hidden = !hasPrice;
  };
  dayBtns.forEach((b) => b.addEventListener("click", () => showDay(+b.dataset.day)));
  $("#value-order").addEventListener("click", () => {
    openWA(`Hello Korea House Ninano! I'd like to order the ${VALUE[currentDay].name} (GH₵99 Value Menu) for lunch at the Osu branch.`);
  });

  // Today
  const today = new Date().getDay(); // 0 Sun … 6 Sat
  const todayBtn = dayBtns.find((b) => +b.dataset.day === today);
  if (todayBtn) todayBtn.classList.add("is-today");
  showDay(today >= 1 && today <= 5 ? today : 1);

  const todayText = $("#today-text");
  const daySpecial = VALUE[today];
  if (today === 5) {
    todayText.innerHTML = `It's Friday! <a href="#value">Tteokbokki Noodle Bowl</a> for lunch, then the <a href="#buffet">Korean Buffet</a> &amp; live music from 6:30 PM.`;
  } else if (daySpecial && daySpecial.price !== null) {
    todayText.innerHTML = `Today's lunch special: <a href="#value">${daySpecial.name}</a> — GH₵99, 11:30–2:30 at Osu.`;
  } else {
    todayText.innerHTML = `Plan ahead: the <a href="#buffet">Friday Korean Buffet</a> starts 6:30 PM — book early from GH₵260.`;
  }

  /* ---------------- Menu ---------------- */
  const MENU = [
    { id: "bibimbap", name: "Bibimbap", ko: "비빔밥", cat: ["rice"], img: "assets/img/bibimbap.jpg",
      desc: "Rice bowl topped with seasoned vegetables, beef, a fried egg and gochujang." },
    { id: "bulgogi-bowl", name: "Bulgogi Rice Bowl", ko: "불고기 덮밥", cat: ["rice", "grill"], img: "assets/img/value-bulgogi.jpg", price: "GH₵99 Wed lunch",
      desc: "Sweet soy-marinated beef with onions over steamed rice." },
    { id: "spicy-pork", name: "Spicy Pork Rice Bowl", ko: "제육 덮밥", cat: ["rice", "spicy"], img: "assets/img/value-spicy-pork.jpg", price: "GH₵99 Mon lunch",
      desc: "Pork in a fiery gochujang sauce with rice." },
    { id: "fried-rice", name: "Kimchi / Egg Fried Rice", ko: "볶음밥", cat: ["rice"], img: "assets/img/fried-rice.jpg",
      desc: "Wok-fried rice with egg, peas and carrots — ask for the kimchi version." },
    { id: "kimbap", name: "Kimbap", ko: "김밥", cat: ["rice", "street"], img: "assets/img/kimbap.jpg",
      desc: "Seaweed rice rolls filled with ham, egg, pickled radish and vegetables." },
    { id: "japchae", name: "Beef Japchae", ko: "잡채", cat: ["noodles"], img: "assets/img/japchae-beef.jpg",
      desc: "Stir-fried glass noodles with beef, spinach, peppers and sesame." },
    { id: "japchae-bowl", name: "Japchae Rice Bowl", ko: "잡채밥", cat: ["noodles", "rice"], img: "assets/img/value-japchae.jpg", price: "GH₵99 Tue lunch",
      desc: "Glass noodles and vegetables served over rice." },
    { id: "tteokbokki", name: "Tteokbokki Noodle Bowl", ko: "떡볶이", cat: ["noodles", "street", "spicy"], img: "assets/img/tteokbokki-bowl.jpg", price: "GH₵99 Fri lunch", isNew: true,
      desc: "Chewy rice cakes, fish cake and noodles in sweet-spicy sauce with egg." },
    { id: "jjajang", name: "Jjajangmyeon", ko: "짜장면", cat: ["noodles"], emoji: "🍜",
      desc: "Noodles in a rich black-bean sauce with pork and vegetables." },
    { id: "chicken", name: "Korean Fried Chicken", ko: "양념치킨", cat: ["grill", "spicy"], emoji: "🍗",
      desc: "Double-fried crispy chicken glazed in sweet & spicy yangnyeom sauce." },
    { id: "wings", name: "Glazed Chicken Wings", ko: "닭날개", cat: ["grill"], emoji: "🍖",
      desc: "Sticky soy-garlic wings, a buffet favourite." },
    { id: "kimchi-stew", name: "Kimchi Jjigae", ko: "김치찌개", cat: ["grill", "spicy"], emoji: "🍲",
      desc: "Bubbling kimchi stew with pork and tofu, served with rice." },
    { id: "mandu", name: "Mandu Dumplings", ko: "만두", cat: ["street"], emoji: "🥟",
      desc: "Pan-fried Korean dumplings with a soy dipping sauce." },
    { id: "pajeon", name: "Kimchi Pancake", ko: "김치전", cat: ["street", "spicy"], emoji: "🥞",
      desc: "Crispy savoury pancake with kimchi and spring onion." },
    { id: "squid", name: "Fried Squid Rings", ko: "오징어 튀김", cat: ["street"], emoji: "🦑",
      desc: "Golden battered squid, perfect for sharing." },
    { id: "kimchi", name: "House Kimchi", ko: "김치", cat: ["street", "spicy"], emoji: "🥬",
      desc: "Our own fermented napa cabbage kimchi." },
  ];

  const grid = $("#menu-grid");
  const cart = new Map(JSON.parse(safeGet("khn-cart") || "[]"));

  function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
  function safeSet(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

  const renderMenu = (filter = "all") => {
    const items = MENU.filter((m) => filter === "all" || m.cat.includes(filter));
    grid.innerHTML = items.map((m, i) => `
      <article class="dish" style="animation-delay:${i * 40}ms">
        <div class="dish__img">${m.img ? `<img src="${m.img}" alt="${m.name}" loading="lazy">` : `<span aria-hidden="true">${m.emoji}</span>`}</div>
        <div class="dish__body">
          <h3>${m.name}${m.isNew ? '<span class="badge">NEW</span>' : ""}${m.cat.includes("spicy") ? ' <span title="Spicy">🌶</span>' : ""}</h3>
          <div class="dish__ko" lang="ko">${m.ko}</div>
          <p>${m.desc}</p>
          <div class="dish__foot">
            <span class="dish__price">${m.price || "Ask for price"}</span>
            <button class="dish__add ${cart.has(m.id) ? "is-added" : ""}" data-id="${m.id}" aria-label="Add ${m.name} to order list">${cart.has(m.id) ? "✓" : "+"}</button>
          </div>
        </div>
      </article>`).join("");
  };

  $$(".filters .chip").forEach((c) => c.addEventListener("click", () => {
    $$(".filters .chip").forEach((x) => x.classList.toggle("is-active", x === c));
    renderMenu(c.dataset.filter);
  }));

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".dish__add");
    if (!btn) return;
    const id = btn.dataset.id;
    cart.set(id, (cart.get(id) || 0) + 1);
    btn.classList.add("is-added");
    btn.textContent = "✓";
    toast(`${MENU.find((m) => m.id === id).name} added to your order list`);
    updateCart();
  });

  /* ---------------- Cart ---------------- */
  const cartEl = $("#cart");
  const cartPanel = $("#cart-panel");
  const cartToggle = $("#cart-toggle");

  const updateCart = () => {
    safeSet("khn-cart", JSON.stringify([...cart]));
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    $("#cart-count").textContent = count;
    cartEl.hidden = count === 0;
    if (count === 0) { cartPanel.hidden = true; cartToggle.setAttribute("aria-expanded", "false"); }
    $("#cart-items").innerHTML = [...cart].map(([id, q]) => {
      const m = MENU.find((x) => x.id === id);
      return `<li><span>${m.name}</span><span class="qty">
        <button data-q="-1" data-id="${id}" aria-label="Fewer ${m.name}">−</button>${q}
        <button data-q="1" data-id="${id}" aria-label="More ${m.name}">+</button></span></li>`;
    }).join("");
    $$(".dish__add").forEach((b) => {
      const has = cart.has(b.dataset.id);
      b.classList.toggle("is-added", has);
      b.textContent = has ? "✓" : "+";
    });
  };

  cartToggle.addEventListener("click", () => {
    const open = cartPanel.hidden;
    cartPanel.hidden = !open;
    cartToggle.setAttribute("aria-expanded", String(open));
  });
  $("#cart-items").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-q]");
    if (!b) return;
    const n = (cart.get(b.dataset.id) || 0) + Number(b.dataset.q);
    n <= 0 ? cart.delete(b.dataset.id) : cart.set(b.dataset.id, n);
    updateCart();
  });
  $("#cart-clear").addEventListener("click", () => { cart.clear(); updateCart(); });
  $("#cart-send").addEventListener("click", () => {
    const lines = [...cart].map(([id, q]) => `• ${q} × ${MENU.find((m) => m.id === id).name}`);
    openWA(`Hello Korea House Ninano! I'd like to order (${$("#cart-mode").value}, ${$("#cart-branch").value} branch):\n${lines.join("\n")}\n\nPlease confirm the total. Thank you!`);
  });

  renderMenu();
  updateCart();

  /* ---------------- Buffet calculator ---------------- */
  const guests = $("#guests");
  const deposit = $("#deposit");
  const fmt = (n) => "GH₵" + n.toLocaleString("en-GH");

  const buffetPrice = (n, early) => (!early ? 320 : n > 2 ? 260 : 290);

  const calc = () => {
    const n = +guests.value;
    const early = deposit.checked;
    const pp = buffetPrice(n, early);
    $("#guests-out").textContent = n;
    $("#pp").textContent = fmt(pp);
    $("#total").textContent = fmt(pp * n);
    const save = (320 - pp) * n;
    let hint = save > 0 ? `You save ${fmt(save)} vs. the regular price.` : "";
    if (!early) hint = `Pay an early deposit to save up to ${fmt((320 - buffetPrice(n, true)) * n)}.`;
    else if (n <= 2) hint += ` Add ${3 - n} more guest${3 - n > 1 ? "s" : ""} to unlock GH₵260 per person.`;
    $("#calc-hint").textContent = hint.trim();
  };
  guests.addEventListener("input", calc);
  deposit.addEventListener("change", calc);
  $$(".stepper button").forEach((b) => b.addEventListener("click", () => {
    guests.value = Math.min(20, Math.max(1, +guests.value + +b.dataset.step));
    calc();
  }));
  calc();

  // Pre-fill reservation form from the calculator
  const nextFriday = () => {
    const d = new Date();
    d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7));
    return d;
  };
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  $("#buffet-book").addEventListener("click", () => {
    $("#r-type").value = "Friday Buffet";
    $("#r-branch").value = "Osu";
    $("#r-guests").value = guests.value;
    $("#r-deposit").checked = deposit.checked;
    $("#r-date").value = isoDate(nextFriday());
    $("#r-time").value = "18:30";
    setTimeout(() => $("#r-name").focus({ preventScroll: true }), 600);
  });

  /* ---------------- Reservation form ---------------- */
  const form = $("#reserve-form");
  const dateInput = $("#r-date");
  dateInput.min = isoDate(new Date());

  $("#r-type").addEventListener("change", (e) => {
    if (e.target.value === "Friday Buffet") {
      $("#r-branch").value = "Osu";
      $("#r-time").value = "18:30";
      if (!dateInput.value) dateInput.value = isoDate(nextFriday());
    } else if (e.target.value === "Value Menu Lunch") {
      $("#r-branch").value = "Osu";
      $("#r-time").value = "12:00";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = $("#r-msg");
    const required = $$("[required]", form);
    let firstBad = null;
    required.forEach((el) => {
      const bad = !el.value.trim() || !el.checkValidity();
      el.classList.toggle("is-invalid", bad);
      if (bad && !firstBad) firstBad = el;
    });
    if (firstBad) {
      msg.textContent = "Please fill in the highlighted fields.";
      firstBad.focus();
      return;
    }
    const f = Object.fromEntries(new FormData(form));
    const when = new Date(`${f.date}T${f.time}`);
    if (f.type === "Friday Buffet" && when.getDay() !== 5) {
      msg.textContent = "The Korean Buffet runs on Fridays only — please choose a Friday.";
      dateInput.classList.add("is-invalid");
      dateInput.focus();
      return;
    }
    msg.textContent = "";
    const dateStr = when.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    let text = `Hello Korea House Ninano! I'd like to make a reservation.\n\n` +
      `Name: ${f.name}\nPhone: ${f.phone}\nBooking: ${f.type}\nBranch: ${f.branch}\n` +
      `Date: ${dateStr}\nTime: ${f.time}\nGuests: ${f.guests}\nEarly deposit: ${f.deposit ? "Yes" : "No"}`;
    if (f.type === "Friday Buffet") {
      const pp = buffetPrice(+f.guests, !!f.deposit);
      text += `\nEstimated buffet price: ${fmt(pp)} pp (${fmt(pp * f.guests)} total)`;
    }
    if (f.notes.trim()) text += `\nNotes: ${f.notes.trim()}`;
    openWA(text);
    toast("Opening WhatsApp with your booking…");
  });
  $$("input, select", form).forEach((el) => el.addEventListener("input", () => el.classList.remove("is-invalid")));

  /* ---------------- Locations ---------------- */
  const LOCS = {
    osu: {
      name: "Osu Branch", map: "Korea+House+Ninano+Osu+Accra", phone: "+233577737722", phoneLabel: "057 773 7722",
      items: ["📍 Osu, Accra", "🍽 Friday Korean Buffet · 6:30 PM", "🍱 GH₵99 Value Menu · 11:30 AM – 2:30 PM", "🎸 Live music on Friday nights"],
    },
    legon: {
      name: "East Legon Branch", map: "Korea+House+Ninano+East+Legon+Accra", phone: "+233577737721", phoneLabel: "057 773 7721",
      items: ["📍 East Legon, Accra", "🍽 Full Korean & Japanese menu", "🛵 Delivery available — ask on WhatsApp"],
    },
  };
  const showLoc = (key) => {
    const l = LOCS[key];
    $$(".loc-tabs .chip").forEach((c) => {
      const on = c.dataset.loc === key;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", String(on));
    });
    $("#loc-info").innerHTML = `
      <h3>${l.name}</h3>
      <ul>${l.items.map((i) => `<li>${i}</li>`).join("")}<li>📞 <a href="tel:${l.phone}">${l.phoneLabel}</a></li></ul>
      <div class="btns">
        <a class="btn btn--red btn--sm" href="https://www.google.com/maps/search/?api=1&query=${l.map}" target="_blank" rel="noopener">Get directions</a>
        <a class="btn btn--outline btn--sm" href="tel:${l.phone}">Call branch</a>
      </div>`;
    $("#loc-map").src = `https://www.google.com/maps?q=${l.map}&output=embed`;
    $("#loc-map").title = `Map of ${l.name}`;
  };
  $$(".loc-tabs .chip").forEach((c) => c.addEventListener("click", () => showLoc(c.dataset.loc)));
  showLoc("osu");

  /* ---------------- Gallery lightbox ---------------- */
  const shots = $$("#gallery-grid button");
  const lb = $("#lightbox");
  let idx = 0;
  let lastFocus = null;
  const showShot = (i) => {
    idx = (i + shots.length) % shots.length;
    $("#lb-img").src = shots[idx].dataset.src;
    $("#lb-img").alt = shots[idx].dataset.caption;
    $("#lb-cap").textContent = shots[idx].dataset.caption;
  };
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; lastFocus && lastFocus.focus(); };
  shots.forEach((s, i) => s.addEventListener("click", () => {
    lastFocus = s;
    showShot(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    $(".lightbox__close").focus();
  }));
  $(".lightbox__close").addEventListener("click", closeLb);
  $(".lightbox__prev").addEventListener("click", () => showShot(idx - 1));
  $(".lightbox__next").addEventListener("click", () => showShot(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showShot(idx - 1);
    if (e.key === "ArrowRight") showShot(idx + 1);
  });
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showShot(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = $$(".section__head, .value-card, .buffet__grid > *, .nights__grid > *, .gallery, .reserve__grid > *, .loc, .job");
  revealEls.forEach((el) => el.classList.add("reveal"));
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => ro.observe(el));

  $("#year").textContent = new Date().getFullYear();
})();

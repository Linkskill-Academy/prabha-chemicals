(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.innerWidth < 640;

  /* -----------------------------------------------------------
     NAV: scrolled state, mobile toggle, scrollspy
  ----------------------------------------------------------- */
  var siteNav = document.getElementById("siteNav");
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function onScrollNav() {
    if (window.scrollY > 30) siteNav.classList.add("scrolled");
    else siteNav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!open));
    mobileNav.classList.toggle("open", !open);
  });

  document.querySelectorAll("[data-nav]").forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("open");
    });
  });

  var navLinks = document.querySelectorAll("[data-nav]");
  var navSections = Array.prototype.slice.call(navLinks)
    .map(function (l) { return document.querySelector(l.getAttribute("href")); })
    .filter(Boolean);

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = "#" + entry.target.id;
        navLinks.forEach(function (l) {
          l.classList.toggle("active", l.getAttribute("href") === id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
  navSections.forEach(function (s) { spyObserver.observe(s); });

  /* -----------------------------------------------------------
     SCROLL PROGRESS BAR
  ----------------------------------------------------------- */
  var progressBar = document.getElementById("scrollProgress");
  function onScrollProgress() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* -----------------------------------------------------------
     REVEAL ON SCROLL
  ----------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealObserver.observe(el); });

  /* -----------------------------------------------------------
     HERO PARTICLES (rising bubbles), skipped on reduced-motion
  ----------------------------------------------------------- */
  var heroParticles = document.getElementById("heroParticles");
  if (heroParticles && !reduceMotion) {
    var count = isMobile ? 8 : 18;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      var size = 3 + Math.random() * 6;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = (8 + Math.random() * 10) + "s";
      p.style.animationDelay = (Math.random() * 10) + "s";
      heroParticles.appendChild(p);
    }
  }

  /* -----------------------------------------------------------
     DEALER NETWORK decorative nodes
  ----------------------------------------------------------- */
  var dealerNetwork = document.getElementById("dealerNetwork");
  if (dealerNetwork) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 1200 500");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.style.width = "100%";
    svg.style.height = "100%";
    var nodes = [];
    var nodeCount = isMobile ? 14 : 26;
    for (var n = 0; n < nodeCount; n++) {
      nodes.push({ x: Math.random() * 1200, y: Math.random() * 500 });
    }
    nodes.forEach(function (node, idx) {
      nodes.slice(idx + 1).forEach(function (other) {
        var dx = node.x - other.x, dy = node.y - other.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 170) {
          var line = document.createElementNS(svgNS, "line");
          line.setAttribute("x1", node.x); line.setAttribute("y1", node.y);
          line.setAttribute("x2", other.x); line.setAttribute("y2", other.y);
          line.setAttribute("stroke", "rgba(139,233,255,0.14)");
          line.setAttribute("stroke-width", "1");
          svg.appendChild(line);
        }
      });
    });
    nodes.forEach(function (node) {
      var c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", node.x); c.setAttribute("cy", node.y);
      c.setAttribute("r", 2 + Math.random() * 2.4);
      c.setAttribute("fill", "rgba(139,233,255,0.55)");
      svg.appendChild(c);
    });
    dealerNetwork.appendChild(svg);
  }

  /* -----------------------------------------------------------
     COUNT-UP NUMBERS
  ----------------------------------------------------------- */
  var countEls = document.querySelectorAll(".count-up");
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute("data-count"), 10);
      countObserver.unobserve(el);
      if (reduceMotion) { el.textContent = target; return; }
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  countEls.forEach(function (el) { countObserver.observe(el); });

  /* -----------------------------------------------------------
     FORMULATION TIMELINE ACTIVATION
  ----------------------------------------------------------- */
  var timeline = document.getElementById("formulationTimeline");
  if (timeline) {
    var timelineObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          timeline.classList.add("active");
          timelineObserver.unobserve(timeline);
        }
      });
    }, { threshold: 0.4 });
    timelineObserver.observe(timeline);
  }

  /* -----------------------------------------------------------
     PRODUCT DATA (facts sourced from real Sembaruthi / Alfa Blue
     packaging photography supplied with the project — no
     invented certifications, counts or technical claims)
  ----------------------------------------------------------- */
  var PRODUCTS = [
    {
      id: "powder", name: "Detergent Washing Powder", brand: "Sembaruthi",
      cats: ["laundry", "commercial"], img: "assets/images/detergent-washing-powder.jpg",
      benefit: "Super Wash detergent powder for effective, everyday laundry cleaning.",
      pack: "100 g · 250 g · 500 g · 1 kg",
      features: ["Super Wash formula", "New improved formula", "Trusted since 2001"],
      featured: true
    },
    {
      id: "soap", name: "Detergent Soap", brand: "Alfa Blue &amp; Sembaruthi",
      cats: ["laundry"], img: "assets/images/detergent-soap-alfa.jpg",
      benefit: "Convenient detergent cake for regular hand-wash laundry, available under the Alfa Blue and Sembaruthi brands.",
      pack: "170 g (Alfa Blue) · 250 g (Sembaruthi)",
      features: ["Strong Power cleaning", "Lemon-fresh finish", "Two brand options"]
    },
    {
      id: "matic", name: "Matic Liquid", brand: "Sembaruthi",
      cats: ["laundry"], img: "assets/images/matic-liquid-bottle.jpg",
      benefit: "Liquid detergent for matic and hand-wash laundry &mdash; deep clean with a fresh fragrance.",
      pack: "150 ml · 500 ml · 1 L · 5 L",
      features: ["Ultra Clean for bright clothes", "Deep clean formula", "Safe for hands"]
    },
    {
      id: "dishliquid", name: "Dishwash Liquid", brand: "Sembaruthi",
      cats: ["dishwash"], img: "assets/images/dishwash-liquid.jpg",
      benefit: "Active Power lime-fresh dishwash liquid &mdash; tough on grease, soft on hands.",
      pack: "150 ml · 500 ml",
      features: ["Powerful degreasing", "Sparkling clean", "Gentle on hands", "Fragrance: Lime Fresh"]
    },
    {
      id: "dishsoap", name: "Dishwash Soap", brand: "Alfa Blue",
      cats: ["dishwash"], img: "assets/images/dishwash-soap.jpg",
      benefit: "Dishwash bar for everyday utensil cleaning in home and commercial kitchens.",
      pack: "140 g",
      features: ["Super Clean formula", "Lemon-fresh finish"]
    },
    {
      id: "floor", name: "Floor Cleaner", brand: "Alfa Blue",
      cats: ["floor", "commercial"], img: "assets/images/floor-cleaner.jpg",
      benefit: "10X cleaning floor cleaner with long-lasting fragrance, available in multiple scents.",
      pack: "1 L · 5 L",
      features: ["10X cleaning &amp; germ protection", "Shine &amp; sparkle", "Safe on floors", "Fragrances: Lavender, Rose, Jasmine, Lemon, Lily &amp; Ocean Breeze"],
      featured: true
    },
    {
      id: "kitchen", name: "Kitchen Cleaner", brand: "Alfa Blue",
      cats: ["professional", "commercial"], img: "assets/images/kitchen-cleaner.jpg",
      benefit: "Spray-on kitchen cleaner for hotels, restaurants and home kitchens &mdash; tough on grease.",
      pack: "500 ml spray · 1 L · 5 L bulk",
      features: ["Removes tough grease &amp; oil", "Hygienic on kitchen surfaces", "Fresh lemon fragrance"]
    },
    {
      id: "glass", name: "Glass Cleaner", brand: "Alfa Blue",
      cats: ["professional"], img: "assets/images/glass-cleaner.jpg",
      benefit: "Plant-based, ammonia-free glass cleaner for a streak-free shine on glass, mirrors and windows.",
      pack: "500 ml · 1 L · 5 L",
      features: ["Streak-free shine", "Plant-based, ammonia-free", "Fast drying"]
    },
    {
      id: "custom", name: "Customized Chemicals", brand: "Prabha Chemicals",
      cats: ["customized"], img: null,
      benefit: "Fully customized formulation solutions developed to your requirement, application and specification.",
      pack: "Packaging &amp; quantity discussed per project",
      features: ["Requirement-based formulation", "Custom fragrance &amp; colour", "Custom packaging"]
    }
  ];

  var CAT_LABEL = { laundry: "Laundry", dishwash: "Dishwash", floor: "Floor Care", professional: "Professional", commercial: "Commercial", customized: "Customized" };

  var flaskIconSvg = '<svg viewBox="0 0 100 100" width="46%" style="opacity:.5"><path d="M42 14h16v20l16 34a7 7 0 0 1-6.2 10H32.2A7 7 0 0 1 26 68l16-34V14Z" fill="none" stroke="#0891b2" stroke-width="2.4"/><path d="M39 14h22" stroke="#0891b2" stroke-width="2.4" stroke-linecap="round"/></svg>';

  function productMediaHtml(p) {
    if (p.img) {
      return '<div class="product-media">' +
        '<span class="product-brand-tag">' + p.brand + '</span>' +
        '<img src="' + p.img + '" alt="' + p.name + ' by Prabha Chemicals" loading="lazy" width="600" height="450">' +
        '<span class="media-bubbles" aria-hidden="true">' +
          '<span style="left:30%;animation-delay:.1s"></span><span style="left:55%;animation-delay:.6s"></span><span style="left:75%;animation-delay:1.1s"></span>' +
        '</span></div>';
    }
    return '<div class="product-media" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eefcff,#dff8fc);">' +
      '<span class="product-brand-tag">' + p.brand + '</span>' + flaskIconSvg + '</div>';
  }

  function renderProducts(filter) {
    var grid = document.getElementById("productGrid");
    grid.innerHTML = "";
    var list = PRODUCTS.filter(function (p) { return filter === "all" || p.cats.indexOf(filter) !== -1; });
    list.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "product-card" + (p.featured ? " featured" : "");
      card.style.animationDelay = (i * 0.06) + "s";
      card.innerHTML =
        productMediaHtml(p) +
        '<div class="product-body">' +
          '<span class="product-cat">' + p.cats.map(function (c) { return CAT_LABEL[c]; }).join(" · ") + '</span>' +
          '<h3 class="product-name">' + p.name + '</h3>' +
          '<p class="product-benefit">' + p.benefit + '</p>' +
          '<span class="product-meta">' + p.pack + '</span>' +
          '<button class="product-cta" type="button" data-open="' + p.id + '">View Details <span class="arrow" aria-hidden="true">&rarr;</span></button>' +
        '</div>';
      grid.appendChild(card);
    });
    grid.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () { openDrawer(btn.getAttribute("data-open")); });
    });
  }
  renderProducts("all");

  var filterButtons = document.querySelectorAll(".seg-btn");
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
      renderProducts(btn.getAttribute("data-filter"));
    });
  });

  /* -----------------------------------------------------------
     PRODUCT DRAWER
  ----------------------------------------------------------- */
  var drawer = document.getElementById("productDrawer");
  var drawerOverlay = document.getElementById("drawerOverlay");
  var drawerContent = document.getElementById("drawerContent");
  var drawerClose = document.getElementById("drawerClose");
  var lastFocused = null;

  function openDrawer(id) {
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocused = document.activeElement;
    drawerContent.innerHTML =
      (p.img
        ? '<div class="drawer-media"><img src="' + p.img + '" alt="' + p.name + '"></div>'
        : '<div class="drawer-media" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#eefcff,#dff8fc);">' + flaskIconSvg + '</div>') +
      '<span class="drawer-cat">' + p.brand + '</span>' +
      '<h2 class="drawer-title" id="drawerTitle">' + p.name + '</h2>' +
      '<p class="drawer-desc">' + p.benefit + '</p>' +
      '<dl class="drawer-meta">' +
        '<div class="drawer-meta-item"><dt>Category</dt><dd>' + p.cats.map(function (c) { return CAT_LABEL[c]; }).join(", ") + '</dd></div>' +
        '<div class="drawer-meta-item"><dt>Available Pack Sizes</dt><dd>' + p.pack + '</dd></div>' +
        '<div class="drawer-meta-item"><dt>Highlights</dt><dd>' + p.features.join(" &middot; ") + '</dd></div>' +
      '</dl>' +
      '<button class="btn btn-primary drawer-cta" type="button" data-quote="' + p.name + '">Request Quote for this Product</button>';

    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
    drawer.focus();
    document.body.style.overflow = "hidden";

    drawerContent.querySelector("[data-quote]").addEventListener("click", function () {
      closeDrawer();
      prefillContact("Product Enquiry", p.name);
    });
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  drawerClose.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeDrawer(); });

  /* -----------------------------------------------------------
     FAQ ACCORDION
  ----------------------------------------------------------- */
  document.querySelectorAll(".accordion-trigger").forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    function setState(open) {
      trigger.setAttribute("aria-expanded", String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    }
    setState(trigger.getAttribute("aria-expanded") === "true");
    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".accordion-trigger").forEach(function (t) {
        if (t !== trigger) { t.setAttribute("aria-expanded", "false"); document.getElementById(t.getAttribute("aria-controls")).style.maxHeight = "0px"; }
      });
      setState(!isOpen);
    });
  });
  window.addEventListener("load", function () {
    var openPanel = document.querySelector('.accordion-trigger[aria-expanded="true"]');
    if (openPanel) document.getElementById(openPanel.getAttribute("aria-controls")).style.maxHeight = document.getElementById(openPanel.getAttribute("aria-controls")).scrollHeight + "px";
  });

  /* -----------------------------------------------------------
     CONTACT FORM PRE-FILL + DEALER CTAs
  ----------------------------------------------------------- */
  var reqSelect = document.getElementById("fRequirement");
  var prodSelect = document.getElementById("fProduct");

  function prefillContact(requirement, product) {
    if (requirement) reqSelect.value = requirement;
    if (product) prodSelect.value = product;
    document.getElementById("contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    document.getElementById("fName").focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-requirement]").forEach(function (btn) {
    btn.addEventListener("click", function () { prefillContact(btn.getAttribute("data-requirement"), ""); });
  });

  /* -----------------------------------------------------------
     CONTACT FORM -> WHATSAPP
     No backend/CRM is wired to this form. We build a readable
     enquiry message from the fields and open WhatsApp (wa.me)
     addressed to Prabha Chemicals with it pre-filled, so every
     enquiry reaches a real inbox instead of vanishing into an
     alert() as the previous version did.
  ----------------------------------------------------------- */
  var enquiryForm = document.getElementById("enquiryForm");
  var formNote = document.getElementById("formNote");
  var WHATSAPP_NUMBER = "919600272562";

  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("fName").value.trim();
    var phone = document.getElementById("fPhone").value.trim();
    if (!name || !phone) {
      formNote.style.color = "#c0392b";
      formNote.textContent = "Please fill in your name and phone number.";
      return;
    }
    var company = document.getElementById("fCompany").value.trim();
    var email = document.getElementById("fEmail").value.trim();
    var requirement = reqSelect.value;
    var product = prodSelect.value;
    var location = document.getElementById("fLocation").value.trim();
    var message = document.getElementById("fMessage").value.trim();

    var lines = ["Hello Prabha Chemicals, I'd like to submit an enquiry:", "", "Name: " + name, "Phone: " + phone];
    if (company) lines.push("Company: " + company);
    if (email) lines.push("Email: " + email);
    if (requirement) lines.push("Requirement Type: " + requirement);
    if (product) lines.push("Product: " + product);
    if (location) lines.push("Location: " + location);
    if (message) lines.push("Message: " + message);

    var text = encodeURIComponent(lines.join("\n"));
    window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text, "_blank", "noopener");

    formNote.style.color = "";
    formNote.textContent = "Opening WhatsApp with your enquiry pre-filled — just hit send.";
    enquiryForm.reset();
  });

  /* -----------------------------------------------------------
     BACK TO TOP
  ----------------------------------------------------------- */
  var backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* -----------------------------------------------------------
     MAGNETIC BUTTON HOVER (desktop only, subtle)
  ----------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x * 0.12) + "px," + (y * 0.28) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }
})();

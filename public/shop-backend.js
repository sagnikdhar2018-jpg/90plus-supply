/* Wires the cloned storefront to the real 90+ backend (auth, orders, tracking). */
(function () {
  function headers() {
    const h = { "Content-Type": "application/json" };
    try {
      const token = sessionStorage.getItem("grok-auth.bearer-token");
      if (token) h.Authorization = "Bearer " + token;
    } catch (e) {}
    return h;
  }

  function applySessionUser(user) {
    if (!user || !window.PLAYER_AUTH) return;
    const mapped = {
      id: user.id,
      email: user.email,
      user_metadata: { callsign: (user.email || "player").split("@")[0] },
    };
    window.PLAYER_AUTH.user = mapped;
    window.PLAYER_AUTH.session = { user: mapped, access_token: "ba" };
    try {
      localStorage.setItem("90p_auth_session", JSON.stringify(window.PLAYER_AUTH.session));
    } catch (e) {}
    if (typeof updateAuthNavUI === "function") updateAuthNavUI();
  }

  async function loadSession() {
    try {
      const res = await fetch("/api/session", { credentials: "include", headers: headers() });
      const data = await res.json();
      if (data && data.user) applySessionUser(data.user);
      return data.user || null;
    } catch (e) {
      return null;
    }
  }

  async function authEmail(path, payload) {
    const res = await fetch("/api/auth/" + path, {
      method: "POST",
      credentials: "include",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      const msg = (data.error && (data.error.message || data.error)) || data.message || "Authentication failed";
      throw new Error(typeof msg === "string" ? msg : "Authentication failed");
    }
    return data;
  }

  document.addEventListener(
    "submit",
    function (e) {
      const form = e.target;
      if (!form || !form.id) return;
      if (form.id === "pageLoginForm") {
        e.preventDefault();
        e.stopPropagation();
        const email = document.getElementById("pageLoginEmail")?.value;
        const password = document.getElementById("pageLoginPassword")?.value;
        const errorEl = document.getElementById("pageLoginError");
        if (errorEl) errorEl.textContent = "";
        authEmail("sign-in/email", { email, password })
          .then(function (data) {
            const user = data.user || (data.data && data.data.user);
            if (user) applySessionUser(user);
            if (typeof toast === "function") toast("Signed in to locker", "shield-check");
            window.location.hash = "#/locker-room";
            if (typeof handleRoute === "function") handleRoute();
          })
          .catch(function (err) {
            if (errorEl) errorEl.textContent = err.message;
            if (typeof playSound === "function") playSound("error");
          });
      }
      if (form.id === "pageRegisterForm") {
        e.preventDefault();
        e.stopPropagation();
        if (!document.getElementById("regConsent")?.checked) {
          if (typeof toast === "function") toast("Please acknowledge statutory privacy consent to create your profile", "alert-circle");
          return;
        }
        const callsign = document.getElementById("pageRegCallsign")?.value;
        const email = document.getElementById("pageRegEmail")?.value;
        const password = document.getElementById("pageRegPassword")?.value;
        const statusEl = document.getElementById("pageRegStatus");
        authEmail("sign-up/email", { email, password, name: callsign || email })
          .then(function (data) {
            const user = data.user || (data.data && data.data.user);
            if (user) applySessionUser(user);
            if (typeof toast === "function") toast("Profile created", "shield-check");
            window.location.hash = "#/locker-room";
            if (typeof handleRoute === "function") handleRoute();
          })
          .catch(function (err) {
            if (statusEl) {
              statusEl.textContent = err.message;
              statusEl.style.color = "var(--err)";
            }
          });
      }
    },
    true,
  );

  document.addEventListener(
    "click",
    function (e) {
      const notify = e.target && e.target.closest && e.target.closest("[data-notify]");
      if (notify) {
        e.preventDefault();
        e.stopPropagation();
        const pid = notify.getAttribute("data-notify");
        const email = window.prompt("Email for restock alert", (window.PLAYER_AUTH && window.PLAYER_AUTH.getCurrentUser && window.PLAYER_AUTH.getCurrentUser()?.email) || "");
        if (!email) return;
        fetch("/api/inventory", {
          method: "POST",
          credentials: "include",
          headers: headers(),
          body: JSON.stringify({ email: email, productId: pid }),
        })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
          .then(function (res) {
            if (!res.ok) throw new Error(res.d.error || "Could not save alert");
            if (typeof toast === "function") toast("We'll ping you when this SKU is back", "bell");
          })
          .catch(function (err) {
            if (typeof toast === "function") toast(err.message, "alert-circle");
          });
        return;
      }
      const btn = e.target && e.target.closest && e.target.closest("#pageGoogleLogin, #pageGoogleReg");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "/login";
    },
    true,
  );

  function syncOrder(order) {
    if (!order || !STATE || !STATE.cart) return;
    const lines = STATE.cart.map(function (item) {
      return {
        productId: item.productId,
        qty: item.qty,
        customName: item.customName || "",
        customNumber: item.customNumber || "",
      };
    });
    const customer = order.customer || {};
    fetch("/api/orders", {
      method: "POST",
      credentials: "include",
      headers: headers(),
      body: JSON.stringify({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pin: customer.pin,
        paymentMethod: order.paymentMethod || "cod",
        coupon: STATE.coupon && STATE.coupon.code,
        lines: lines,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (res.status === 401) {
            if (typeof toast === "function") toast("Sign in so this order is saved to your locker", "info");
            return;
          }
          if (!res.ok || !data.order) return;
          order.id = data.order.id;
          order.totals = order.totals || {};
          order.totals.total = data.order.total;
          order.trackingNumber = data.order.trackingNumber;
          order.status = data.order.status;
          try {
            if (typeof saveOrders === "function") saveOrders();
          } catch (e) {}
          window.location.hash = "#/track/" + data.order.id;
          fetch("/api/inventory/live", { credentials: "include" })
            .then(function (r) { return r.json(); })
            .then(function (live) { applySnapshot(live, true); })
            .catch(function () {});
        });
      })
      .catch(function () {});
  }

  function applySnapshot(data, announce) {
    if (!data || !data.items) return;
    const changed = typeof applyLiveStock === "function" ? applyLiveStock(data.items, data.movements) : [];
    if (announce && changed.length && typeof toast === "function") {
      const first = changed[0];
      toast(first.name + " now at " + first.to, "activity");
    }
    const status = document.getElementById("liveInvStatus");
    if (status) {
      status.innerHTML = '<span class="live-dot"></span> Live · ' + new Date().toLocaleTimeString();
    }
  }

  function startLiveInventory() {
    let version = 0;
    let pollTimer = null;
    let socket = null;
    let reconnect = 1500;

    function applyFrom(data, announce) {
      if (!data || data.error || !data.items) return;
      const changed = data.version && data.version !== version;
      version = data.version || version;
      applySnapshot(data, announce && changed);
    }

    function pull(announce) {
      fetch("/api/inventory/live", { credentials: "include" })
        .then(function (r) { return r.json(); })
        .then(function (data) { applyFrom(data, announce); })
        .catch(function () {});
    }

    function startPoll() {
      if (pollTimer) return;
      pull(false);
      pollTimer = setInterval(function () { pull(true); }, 4000);
    }

    function stopPoll() {
      if (!pollTimer) return;
      clearInterval(pollTimer);
      pollTimer = null;
    }

    function wsSupported() {
      // ponytail: /ws/inventory is Vite-dev only (vite.config inventoryWsPlugin).
      // Vercel has no upgrade handler — skip WS, poll /api/inventory/live.
      const h = location.hostname;
      return h === "localhost" || h === "127.0.0.1" || h.endsWith(".local");
    }

    function connectWs() {
      if (!wsSupported()) {
        startPoll();
        return;
      }
      if (socket && (socket.readyState === 0 || socket.readyState === 1)) return;
      const proto = location.protocol === "https:" ? "wss:" : "ws:";
      let ws;
      try {
        ws = new WebSocket(proto + "//" + location.host + "/ws/inventory");
      } catch (e) {
        startPoll();
        return;
      }
      socket = ws;
      ws.onopen = function () {
        reconnect = 1500;
        stopPoll();
        const status = document.getElementById("liveInvStatus");
        if (status) status.innerHTML = '<span class="live-dot"></span> WebSocket live';
      };
      ws.onmessage = function (ev) {
        try {
          applyFrom(JSON.parse(ev.data), true);
        } catch (e) {}
      };
      ws.onclose = function () {
        socket = null;
        startPoll();
        setTimeout(connectWs, reconnect);
        reconnect = Math.min(reconnect * 1.6, 12000);
      };
      ws.onerror = function () {
        try { ws.close(); } catch (e) {}
      };
    }

    window.__applyLiveInventory = function (announce) { pull(!!announce); };
    connectWs();
    startPoll();
  }

  const ready = function () {
    loadSession();
    startLiveInventory();
    if (typeof executeOrderPlacement === "function") {
      const prev = executeOrderPlacement;
      executeOrderPlacement = function () {
        const sessionUser = window.PLAYER_AUTH && window.PLAYER_AUTH.getCurrentUser && window.PLAYER_AUTH.getCurrentUser();
        if (!sessionUser) {
          if (typeof toast === "function") toast("Sign in to your locker before placing an order", "lock");
          window.location.hash = "#/login";
          if (typeof handleRoute === "function") handleRoute();
          return;
        }
        const before = STATE.orders && STATE.orders[0] && STATE.orders[0].id;
        prev.apply(this, arguments);
        const after = STATE.orders && STATE.orders[0];
        if (after && after.id !== before) syncOrder(after);
      };
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();

  window.addEventListener("hashchange", function () {
    const hash = location.hash || "";
    const m = hash.match(/#\/track\/([^/]+)/);
    if (!m) return;
    fetch("/api/orders/" + encodeURIComponent(m[1]), { credentials: "include" })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (!data.order) return;
        const o = data.order;
        if (!window.STATE) return;
        const exists = STATE.orders && STATE.orders.find(function (x) {
          return x.id === o.id;
        });
        if (exists) {
          exists.status = o.status;
          exists.trackingNumber = o.trackingNumber;
          return;
        }
        STATE.orders = STATE.orders || [];
        STATE.orders.unshift({
          id: o.id,
          timestamp: Date.now(),
          customer: { name: "Player", city: o.city },
          items: o.items,
          totals: { total: o.total },
          status: o.status,
          trackingNumber: o.trackingNumber,
        });
      })
      .catch(function () {});
  });
})();

/* =====================================================================
   GM Pharmacy — main.js
   No dependencies. Handles: mobile nav, sticky header, live open/closed
   status, today's-hours highlighting, storefront photo swap, year.
   ===================================================================== */
(function () {
  'use strict';

  /* -----------------------------------------------------------------
     STORE HOURS — edit here and the whole site updates.
     Key = day of week (0 = Sunday). null = closed.
     Times are 24h decimal: 17.5 means 5:30 PM.
     ----------------------------------------------------------------- */
  var HOURS = {
    0: null,                 // Sunday   — closed
    1: { open: 10, close: 17 },
    2: { open: 10, close: 17 },
    3: { open: 10, close: 17 },
    4: { open: 10, close: 17 },
    5: { open: 10, close: 17 },
    6: { open: 10, close: 14 }  // Saturday
  };

  var TIME_ZONE = 'America/Detroit';
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  /* ---------- helpers ---------- */

  // Current {day, hour} at the pharmacy, regardless of the visitor's own
  // timezone. Falls back to local time if Intl isn't available.
  function storeNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: TIME_ZONE, weekday: 'short', hour: 'numeric',
        minute: 'numeric', hour12: false
      }).formatToParts(new Date());

      var get = function (type) {
        for (var i = 0; i < parts.length; i++) { if (parts[i].type === type) return parts[i].value; }
        return null;
      };
      var shortDays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hour = parseInt(get('hour'), 10);
      if (hour === 24) hour = 0;                       // some engines report 24
      return { day: shortDays[get('weekday')], hour: hour + parseInt(get('minute'), 10) / 60 };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), hour: d.getHours() + d.getMinutes() / 60 };
    }
  }

  function fmt(decimalHour) {
    var h = Math.floor(decimalHour);
    var m = Math.round((decimalHour - h) * 60);
    var suffix = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + suffix;
  }

  function rangeLabel(entry) {
    return entry ? fmt(entry.open) + ' – ' + fmt(entry.close) : 'Closed';
  }

  // Next day (within a week) that has hours. Returns { day, entry, isTomorrow }.
  function nextOpenDay(fromDay) {
    for (var i = 1; i <= 7; i++) {
      var d = (fromDay + i) % 7;
      if (HOURS[d]) return { day: d, entry: HOURS[d], isTomorrow: i === 1 };
    }
    return null;
  }

  /* ---------- 1. Live open / closed status ---------- */
  function renderStatus() {
    var pill = document.getElementById('statusPill');
    var detail = document.getElementById('statusDetail');
    var todayEl = document.getElementById('todayHours');
    if (!pill) return;

    var now = storeNow();
    var today = HOURS[now.day];

    if (todayEl) todayEl.textContent = today ? rangeLabel(today) : 'Closed today';

    var isOpen = !!today && now.hour >= today.open && now.hour < today.close;

    if (isOpen) {
      pill.textContent = 'Open now';
      pill.className = 'status__pill is-open';
      var left = today.close - now.hour;
      detail.textContent = left <= 1
        ? 'Closing at ' + fmt(today.close) + ' — about ' + Math.max(1, Math.round(left * 60)) + ' min left'
        : 'Open until ' + fmt(today.close) + ' today';
      return;
    }

    pill.textContent = 'Closed';
    pill.className = 'status__pill is-closed';

    // Opening later today?
    if (today && now.hour < today.open) {
      detail.textContent = 'Opens today at ' + fmt(today.open);
      return;
    }

    var next = nextOpenDay(now.day);
    detail.textContent = next
      ? 'Opens ' + (next.isTomorrow ? 'tomorrow' : DAY_NAMES[next.day]) + ' at ' + fmt(next.entry.open)
      : '';
  }

  /* ---------- 2. Highlight today's row in the hours table ---------- */
  function highlightToday() {
    var today = storeNow().day;
    var rows = document.querySelectorAll('.hours__table tr[data-day]');
    for (var i = 0; i < rows.length; i++) {
      rows[i].classList.toggle('is-today', Number(rows[i].getAttribute('data-day')) === today);
    }
  }

  /* ---------- 3. Mobile nav ---------- */
  function initNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close after tapping a link, and on Escape
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------- 4. Sticky header shadow ---------- */
  function initHeader() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 5. Swap in a real storefront photo if one exists ---------- */
  function initPhoto() {
    var box = document.getElementById('storefrontPhoto');
    if (!box) return;
    var img = new Image();
    img.onload = function () {
      img.alt = 'The GM Pharmacy storefront on Ford Rd in Garden City, Michigan';
      img.loading = 'lazy';
      box.replaceWith(img);
    };
    img.src = 'images/storefront.jpg';
  }

  /* ---------- 6. Footer year ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- go ---------- */
  function init() {
    renderStatus();
    highlightToday();
    initNav();
    initHeader();
    initPhoto();
    initYear();
    // Keep the open/closed pill honest on long-lived tabs.
    setInterval(function () { renderStatus(); highlightToday(); }, 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

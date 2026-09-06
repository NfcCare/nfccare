// ==========================================================================
// NFC Care — script.js
// ==========================================================================

/* ---------- CONFIGURACIÓN (edítalo aquí) ---------- */
const CONFIG = {
  // Número de WhatsApp de soporte, en formato internacional sin espacios ni "+".
  // Ejemplo: "34600000000". Déjalo vacío hasta tener el número real.
  WHATSAPP_SUPPORT_NUMBER: "34609908996",

  // Nombre del negocio que se incluirá en el mensaje automático de WhatsApp.
};

/* ---------- Header: sombra/borde al hacer scroll ---------- */
const header = document.getElementById("header");
if (header) {
  const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });
}

/* ---------- Menú móvil ---------- */
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Acordeón FAQ ---------- */
document.querySelectorAll(".accordion__trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion__item");
    const isOpen = item.classList.contains("is-open");

    // Cierra los demás para mantener el acordeón ordenado.
    document.querySelectorAll(".accordion__item.is-open").forEach((openItem) => {
      openItem.classList.remove("is-open");
      openItem.querySelector(".accordion__trigger").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------- Revelado suave al hacer scroll (una sola vez por elemento) ---------- */
const revealTargets = document.querySelectorAll(
  ".step, .plan, .advantage, .producto__copy, .producto__visual, .hero__copy, .hero__visual"
);
revealTargets.forEach((el) => el.setAttribute("data-reveal", ""));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

/* ---------- Enlaces de WhatsApp (construidos automáticamente) ---------- */
function buildWhatsAppLink() {
  const number = CONFIG.WHATSAPP_SUPPORT_NUMBER;
  const message = `Hola, tengo un problema con mi tarjeta NFC.`;
  const encodedMessage = encodeURIComponent(message);

  if (!number) {
    // Sin número configurado todavía: evita generar un enlace roto.
    return null;
  }
  return `https://wa.me/${number}?text=${encodedMessage}`;
}

function wireWhatsAppButton(el) {
  if (!el) return;
  const link = buildWhatsAppLink();
  if (link) {
    el.href = link;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  } else {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      console.warn(
        "WHATSAPP_SUPPORT_NUMBER no está configurado todavía. Edítalo en script.js (CONFIG.WHATSAPP_SUPPORT_NUMBER)."
      );
    });
  }
}

// Se conecta cualquier enlace marcado con esta clase, esté en la página que esté
// (índice, soporte flotante, contacto, o las páginas legales).
document.querySelectorAll(".js-whatsapp-link").forEach(wireWhatsAppButton);

/* ---------- Enlaces de pago de Stripe (Payment Links) ---------- */
// Cada botón de plan lleva un atributo data-stripe-link con el nombre de la
// variable correspondiente. Aquí se sustituye por la URL real cuando la tengas.
const STRIPE_PAYMENT_LINKS = {
  STRIPE_PAYMENT_LINK_1_MONTH: "",
  STRIPE_PAYMENT_LINK_3_MONTHS: "",
  STRIPE_PAYMENT_LINK_6_MONTHS: "",
  STRIPE_PAYMENT_LINK_12_MONTHS: "",
};

document.querySelectorAll("[data-stripe-link]").forEach((btn) => {
  const key = btn.getAttribute("data-stripe-link");
  const url = STRIPE_PAYMENT_LINKS[key];

  if (url) {
    btn.href = url;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  } else {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.warn(
        `${key} no está configurado todavía. Añade el Payment Link de Stripe en script.js (STRIPE_PAYMENT_LINKS).`
      );
    });
  }
});

/* ---------- Portal de cliente de Stripe (gestionar/cancelar suscripción) ---------- */
// Stripe genera un único enlace de acceso al "Customer portal" para toda la cuenta
// (Dashboard → Settings → Billing → Customer portal). Cada cliente entra ahí con su
// email y puede ver y cancelar su propia suscripción, sin que tú tengas que hacer nada
// manualmente ni exponer ninguna clave secreta.
const STRIPE_CUSTOMER_PORTAL_LINK = "";

document.querySelectorAll("[data-stripe-portal-link]").forEach((btn) => {
  if (STRIPE_CUSTOMER_PORTAL_LINK) {
    btn.href = STRIPE_CUSTOMER_PORTAL_LINK;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
  } else {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      console.warn(
        "STRIPE_CUSTOMER_PORTAL_LINK no está configurado todavía. Añade el enlace del Customer Portal de Stripe en script.js."
      );
    });
  }
});

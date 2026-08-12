const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const year = document.querySelector("#year");
const contactEmail = "grandmaster365@lavida.agency";

const closeMenu = () => {
  if (!menuButton || !nav) return;

  menuButton.classList.remove("active");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
};

const openMenu = () => {
  if (!menuButton || !nav) return;

  menuButton.classList.add("active");
  nav.classList.add("open");
  document.body.classList.add("menu-open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Close navigation");
};

menuButton?.addEventListener("click", () => {
  if (nav?.classList.contains("open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

navLinks.forEach(link => link.addEventListener("click", closeMenu));

const updateNavigation = () => {
  header?.classList.toggle("scrolled", window.scrollY > 30);

  const active = sections.reduce((current, section) => {
    return window.scrollY >= section.offsetTop - 180 ? section.id : current;
  }, "home");

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${active}`);
  });
};

window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("resize", updateNavigation);
updateNavigation();

const revealElements = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

const setFormStatus = (message, state = "") => {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.classList.remove("sending", "success", "error");
  if (state) formStatus.classList.add(state);
};

contactForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!event.currentTarget.checkValidity()) {
    setFormStatus("Please enter your name and a valid email address.", "error");
    event.currentTarget.reportValidity();
    return;
  }

  const data = new FormData(event.currentTarget);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const interest = String(data.get("interest") || "").trim();
  const visitorMessage = String(data.get("message") || "").trim();
  const subject = `GrandMaster 365 enquiry from ${name}`;
  const body = [
    "Hello GrandMaster 365,",
    "",
    `Name: ${name}`,
    `Email address: ${email}`,
    `Interest: ${interest}`,
    visitorMessage ? `Message: ${visitorMessage}` : "Message: Not provided"
  ].join("\n");

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  try {
    setFormStatus("Opening your email app...", "sending");
    window.location.href = mailtoUrl;
    window.setTimeout(() => {
      setFormStatus("Email draft opened. Please review and send it from your email app.", "success");
    }, 700);
  } catch (error) {
    setFormStatus(`We could not open your email app. Please email ${contactEmail}.`, "error");
  }
});

if (year) {
  year.textContent = new Date().getFullYear();
}

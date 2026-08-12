(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  root.classList.add("motion-ready");

  const showEverything = () => {
    root.classList.add("page-loaded");
    revealItems.forEach((item) => item.classList.add("is-visible"));
  };

  if (reduceMotion.matches) {
    showEverything();
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.add("page-loaded"));
    });

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8%" }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const trackedSections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.hash) }))
    .filter(({ section }) => section);
  let navFrame = 0;

  const updateCurrentSection = () => {
    navFrame = 0;
    const marker = window.innerHeight * 0.38;
    let current = null;

    trackedSections.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= marker) current = item;
    });

    if (window.scrollY < 240) current = null;

    trackedSections.forEach((item) => {
      const isCurrent = item === current;
      item.link.classList.toggle("is-current", isCurrent);
      if (isCurrent) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  };

  const requestNavUpdate = () => {
    if (navFrame) return;
    navFrame = requestAnimationFrame(updateCurrentSection);
  };

  updateCurrentSection();
  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate);

  reduceMotion.addEventListener?.("change", (event) => {
    if (event.matches) showEverything();
  });
})();

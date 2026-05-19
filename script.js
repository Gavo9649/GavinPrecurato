const internalLinks = document.querySelectorAll('a[href^="#"]');

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealTargets = document.querySelectorAll(
  [
    ".section-heading",
    ".card",
    ".project-card",
    ".case-header",
    ".case-panel",
    ".case-image",
    ".timeline-item",
    ".contact-panel",
  ].join(",")
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.01,
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  window.setTimeout(() => {
    revealTargets.forEach((target) => {
      const rect = target.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.92) {
        target.classList.add("is-visible");
        revealObserver.unobserve(target);
      }
    });
  }, 100);
}

document.querySelectorAll('[data-slideshow]').forEach((figure) => {
  const slides = JSON.parse(figure.dataset.slides);
  if (slides.length < 2) return;

  const img = figure.querySelector('img');
  let current = 0;

  function goTo(index) {
    img.style.transition = 'opacity 400ms ease';
    img.style.opacity = '0';
    setTimeout(() => {
      current = (index + slides.length) % slides.length;
      img.src = slides[current];
      img.style.opacity = '1';
    }, 400);
  }

  figure.querySelector('.slide-arrow--prev').addEventListener('click', () => goTo(current - 1));
  figure.querySelector('.slide-arrow--next').addEventListener('click', () => goTo(current + 1));
});
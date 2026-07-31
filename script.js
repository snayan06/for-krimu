(() => {
  "use strict";

  const screens = [...document.querySelectorAll("[data-screen]")];
  const dots = [...document.querySelectorAll(".progress-dot")];
  const progress = document.querySelector(".progress");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentScreen = 0;

  function showScreen(index) {
    const outgoing = screens[currentScreen];
    const incoming = screens[index];
    if (!incoming || index === currentScreen) return;

    outgoing.classList.add("is-leaving");
    const change = () => {
      outgoing.hidden = true;
      outgoing.classList.remove("is-active", "is-leaving");
      incoming.hidden = false;
      incoming.classList.add("is-active");
      currentScreen = index;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("is-current", dotIndex === index));
      progress.setAttribute("aria-valuenow", String(index + 1));
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      incoming.querySelector("h1, h2")?.focus({ preventScroll: true });
    };

    reducedMotion ? change() : window.setTimeout(change, 300);
  }

  const openStory = document.querySelector("#openStory");
  openStory.addEventListener("click", () => {
    if (currentScreen !== 0 || openStory.classList.contains("is-open")) return;
    openStory.classList.add("is-open");
    burstHearts(8);
    window.setTimeout(() => showScreen(1), reducedMotion ? 20 : 950);
  });

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => showScreen(currentScreen + 1));
  });

  const memoryCards = [...document.querySelectorAll(".memory-card")];
  let memoryIndex = 0;

  memoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (card !== memoryCards[memoryIndex]) return;
      if (memoryIndex < memoryCards.length - 1) {
        card.classList.add("is-exiting");
        card.setAttribute("aria-hidden", "true");
        card.inert = true;
        card.tabIndex = -1;
        memoryIndex += 1;
        memoryCards[memoryIndex].tabIndex = 0;
        memoryCards[memoryIndex].inert = false;
        memoryCards[memoryIndex].removeAttribute("aria-hidden");
        memoryCards[memoryIndex].focus({ preventScroll: true });
      } else {
        memoryCards.forEach((item, index) => {
          item.classList.remove("is-exiting");
          item.tabIndex = index === 0 ? 0 : -1;
          item.inert = index !== 0;
          if (index === 0) item.removeAttribute("aria-hidden");
          else item.setAttribute("aria-hidden", "true");
        });
        memoryIndex = 0;
        memoryCards[0].focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll(".reason-card").forEach((card) => {
    card.addEventListener("click", () => {
      const isRevealed = card.classList.toggle("is-revealed");
      card.setAttribute("aria-pressed", String(isRevealed));
      card.querySelector(".reason-prompt").setAttribute("aria-hidden", String(isRevealed));
      card.querySelector(".reason-copy").setAttribute("aria-hidden", String(!isRevealed));
      if (isRevealed) floatOneHeart(card);
    });
  });

  const letterModal = document.querySelector("#letterModal");
  const openLetter = document.querySelector("#openLetter");
  const closeLetter = document.querySelector("#closeLetter");
  const replayStory = document.querySelector("#replayStory");

  openLetter.addEventListener("click", () => {
    letterModal.showModal();
    burstHearts(24);
    launchConfetti();
  });
  closeLetter.addEventListener("click", () => letterModal.close());
  letterModal.addEventListener("click", (event) => {
    if (event.target === letterModal) letterModal.close();
  });

  replayStory.addEventListener("click", () => {
    if (letterModal.open) letterModal.close();
    openStory.classList.remove("is-open");
    memoryCards.forEach((card, index) => {
      card.classList.remove("is-exiting");
      card.tabIndex = index === 0 ? 0 : -1;
      card.inert = index !== 0;
      if (index === 0) card.removeAttribute("aria-hidden");
      else card.setAttribute("aria-hidden", "true");
    });
    memoryIndex = 0;
    document.querySelectorAll(".reason-card").forEach((card) => {
      card.classList.remove("is-revealed");
      card.setAttribute("aria-pressed", "false");
      card.querySelector(".reason-prompt").setAttribute("aria-hidden", "false");
      card.querySelector(".reason-copy").setAttribute("aria-hidden", "true");
    });
    showScreen(0);
    burstHearts(10);
  });

  function floatOneHeart(origin) {
    if (reducedMotion) return;
    const rect = origin.getBoundingClientRect();
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > .5 ? "♡" : "♥";
    heart.style.left = `${rect.left + rect.width / 2}px`;
    heart.style.bottom = `${window.innerHeight - rect.top - rect.height / 2}px`;
    heart.style.setProperty("--x-start", "0px");
    heart.style.setProperty("--x-end", `${(Math.random() - .5) * 100}px`);
    document.body.append(heart);
    window.setTimeout(() => heart.remove(), 2500);
  }

  function burstHearts(amount) {
    if (reducedMotion) return;
    for (let index = 0; index < amount; index += 1) {
      window.setTimeout(() => {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = index % 3 === 0 ? "♥" : "♡";
        heart.style.left = index % 2 === 0
          ? `${4 + Math.random() * 13}%`
          : `${83 + Math.random() * 13}%`;
        heart.style.fontSize = `${15 + Math.random() * 24}px`;
        heart.style.setProperty("--x-start", `${(Math.random() - .5) * 80}px`);
        heart.style.setProperty("--x-end", `${(Math.random() - .5) * 190}px`);
        document.body.append(heart);
        window.setTimeout(() => heart.remove(), 2500);
      }, index * 55);
    }
  }

  function launchConfetti() {
    if (reducedMotion) return;
    const colors = ["#bd6075", "#e8a5b3", "#c9d2bd", "#f4cf8d", "#fffaf3"];
    for (let index = 0; index < 55; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty("--fall-time", `${1.6 + Math.random() * 1.8}s`);
      piece.style.setProperty("--drift", `${(Math.random() - .5) * 220}px`);
      piece.style.setProperty("--spin", `${360 + Math.random() * 720}deg`);
      piece.style.animationDelay = `${Math.random() * .55}s`;
      document.body.append(piece);
      window.setTimeout(() => piece.remove(), 4000);
    }
  }

  if (!reducedMotion) {
    window.setInterval(() => burstHearts(1), 2800);
  }
})();

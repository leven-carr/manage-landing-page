//
// MOBILE MENU
//
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const mobileMenu = document.getElementById("mobile-menu");

  // --- Function Definitions ---

  //   Visibly open/close mobile menu
  function toggleMenu() {
    // Check state of menu
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    const shouldOpen = !isOpen;

    // Update aria-expanded attribute on menuBtn
    menuBtn.setAttribute("aria-expanded", String(shouldOpen));

    // Update aria-hidden attribute on mobileMenu
    mobileMenu.setAttribute("aria-hidden", String(!shouldOpen));

    // Update layout class
    mobileMenu.classList.toggle("hidden", isOpen);
    menuBackdrop.classList.toggle("hidden", isOpen);

    // Update button icon
    if (shouldOpen) {
      menuBtn.classList.replace("fa-bars", "fa-xmark");
    } else {
      menuBtn.classList.replace("fa-xmark", "fa-bars");
    }

    return shouldOpen;
  }

  //   Handle focus trap for mobile menu
  function handleFocusTrap(e) {
    // Close menu and remove focus trap if Escape key is pressed
    if (e.key === "Escape") {
      toggleMenu();
      document.removeEventListener("keydown", handleFocusTrap);
      menuBtn.focus();
      return;
    }

    // Verify Tab key is being pressed; exit if not
    if (e.key !== "Tab") {
      return;
    }

    // Identify focusable elements: menuBtn and interactable elements contained within the menu
    const menuElements = Array.from(
      mobileMenu.querySelectorAll("button, [href], input"),
    );
    const focusableElements = [menuBtn, ...menuElements];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Looping backwards: if user presses Shift + Tab while on the first focusable element, move focus to last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    // Looping forwards: if user presses Tab while on the last focusable element, move focus to first element
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  // --- Event Listeners ---

  // Toggle menu open/closed on menuBtn click
  menuBtn.addEventListener("click", () => {
    const justOpened = toggleMenu();

    if (justOpened) {
      document.addEventListener("keydown", handleFocusTrap);
      mobileMenu.querySelector("button, [href], input")?.focus();
    } else {
      document.removeEventListener("keydown", handleFocusTrap);
      menuBtn.focus();
    }
  });

  // Close menu on navigation link click
  mobileMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");

    if (!link) {
      return;
    }

    toggleMenu();
    document.removeEventListener("keydown", handleFocusTrap);
    menuBtn.focus();
  });

  // Close menu on backdrop click
  menuBackdrop.addEventListener("click", () => {
    toggleMenu();
    document.removeEventListener("keydown", handleFocusTrap);
    menuBtn.focus();
  });
}

//
// SIGNUP FORM
//
function initSignupForm() {
  const form = document.getElementById("signup-form");
  const emailInput = document.getElementById("email-input");
  const errorMsg = document.getElementById("error-msg");
  const submitBtn = document.getElementById("submit-btn");
  const successModal = document.getElementById("success-modal");
  const dismissBtn = document.getElementById("dismiss-btn");

  // --- Function Definitions ---

  function handleSubmit(e) {
    e.preventDefault();

    if (!emailInput.checkValidity()) {
      showError();
      return;
    }

    clearError();
    successModal.showModal();
    form.reset();
  }

  function showError() {
    emailInput.setAttribute("aria-invalid", String(true));
    errorMsg.textContent = "Please enter a valid email";
  }

  function clearError() {
    emailInput.setAttribute("aria-invalid", String(false));
    errorMsg.textContent = "";
  }

  // --- Event Listeners ---

  form.addEventListener("submit", handleSubmit);
  emailInput.addEventListener("input", clearError);
  dismissBtn.addEventListener("click", () => {
    successModal.close();
  });
}

//
// TESTIMONIALS CAROUSEL
//
async function initCarousel() {
  let testimonials = [];
  let allCards = [];
  let dots = [];
  let currentCardIndex = 1;
  let isTeleporting = false;

  const carouselTrack = document.getElementById("carousel-track");
  const carouselIndicators = document.getElementById("carousel-indicators");

  // --- Function Definitions ---

  // Fetch data and populate testimonials
  async function populateCarousel() {
    // Fetch data
    const response = await fetch("assets/data/testimonials.json");
    testimonials = await response.json();

    const template = document.getElementById("testimonial-template");

    // Create and append cards
    testimonials.forEach((testimonial) => {
      // Clone template
      const clone = template.content.cloneNode(true);

      // Fill in content of clone
      clone.querySelector("img.avatar").src = testimonial.avatar;
      clone.querySelector("h3.client-name").textContent = testimonial.name;
      clone.querySelector("blockquote.review-text").textContent =
        `"${testimonial.review}"`;

      // Append clone to carousel
      carouselTrack.appendChild(clone);
    });
  }

  // Populate indicator dots
  function populateIndicators() {
    const template = document.getElementById("indicator-template");
    const startIndex = testimonials.length >= 3 ? 1 : 0;

    testimonials.forEach((testimonial, i) => {
      // Clone template and ensure we are accessing the button element
      const clone = template.content.cloneNode(true);
      const dotBtn = clone.querySelector("button.carousel-dot");

      // Set accessibility attributes accordingly
      dotBtn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dotBtn.setAttribute("aria-selected", i === startIndex ? "true" : "false");

      // Append clone to indicator container
      carouselIndicators.appendChild(clone);
    });
  }

  // Create and append clones for infinite scrolling
  function createScrollClones() {
    // Get array of populated testimonial cards
    const originalCards = Array.from(carouselTrack.children);

    // Clone first and last card
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[originalCards.length - 1].cloneNode(true);

    // Mark clones with is-clone class
    firstClone.classList.add("is-clone");
    lastClone.classList.add("is-clone");

    // Append clones: firstClone at end of track, lastClone at beginning
    carouselTrack.appendChild(firstClone);
    carouselTrack.insertBefore(lastClone, carouselTrack.firstElementChild);

    // Get array of all cards including clones
    allCards = Array.from(carouselTrack.children);
  }

  // Calculate scroll distance necessary to center a given card
  function getScrollPosition(i) {
    const card = allCards[i];
    const trackWidth = carouselTrack.clientWidth;
    const cardWidth = card.clientWidth;

    const position = card.offsetLeft - (trackWidth - cardWidth) / 2;

    return position;
  }

  // Set carousel's starting position
  function setInitialPosition() {
    // Identify index of starting card
    const totalOriginals = testimonials.length;
    const startIndex = totalOriginals >= 3 ? 1 : 0;
    currentCardIndex = startIndex + 1;

    // Calculate and scroll instantly to that card's centered position
    carouselTrack.scrollTo({
      left: getScrollPosition(currentCardIndex),
      behavior: "auto",
    });
  }

  // Enable navigation from indicator clicks
  function initDotNavigation() {
    dots = Array.from(
      carouselIndicators.querySelectorAll("button.carousel-dot"),
    );

    carouselIndicators.addEventListener("click", (e) => {
      const clickedDot = e.target.closest("button.carousel-dot");
      if (!clickedDot) return;

      // Identify index of the card that corresponds to the clicked dot
      currentCardIndex = dots.indexOf(clickedDot) + 1;

      // Calculate and scroll smoothly to that card's centered position
      carouselTrack.scrollTo({
        left: getScrollPosition(currentCardIndex),
        behavior: "smooth",
      });
    });
  }

  // Enable infinite looping and dot synchronization
  function initScrollListeners() {
    let scrollTimeout;

    carouselTrack.addEventListener("scroll", () => {
      // 1. Synchronize dots
      if (!isTeleporting) {
        // Identify current scroll position, initialize closestIndex variable, initialize minDifference variable at Infinity so that the first real value will always be lower and override it
        const currentScroll = carouselTrack.scrollLeft;
        let closestIndex = 0;
        let minDifference = Infinity;

        // Loop through cards and identify which one has the smallest difference between its current position and its centered position; Math.abs() gets the absolute value of this difference so it will work properly whether the card is to the left or to the right of the center

        // Then update the minDifference and the closestIndex based on the "winning" card
        allCards.forEach((card, i) => {
          const diff = Math.abs(currentScroll - getScrollPosition(i));

          if (diff < minDifference) {
            minDifference = diff;
            closestIndex = i;
          }
        });

        // Account for clones when identifying the corresponding dotIndex
        let dotIndex = closestIndex - 1;

        if (closestIndex === 0) {
          dotIndex = testimonials.length - 1;
        }

        if (closestIndex === allCards.length - 1) {
          dotIndex = 0;
        }

        // Loop through dots and activate the one whose index matches dotIndex
        dots.forEach((dot, i) => {
          dot.setAttribute("aria-selected", i === dotIndex ? "true" : "false");
        });
      }

      // 2. Teleporting behavior; 20ms timer ensures that teleporting will not occur until after the user releases scrolling
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        // Identify the current scroll position, calculate the maximum scroll position of the carousel track, and initialize a buffer to enable teleporting without depending on extreme precision.
        const currentScroll = carouselTrack.scrollLeft;
        const maxScrollLeft =
          carouselTrack.scrollWidth - carouselTrack.clientWidth;
        const endClonePos = getScrollPosition(allCards.length - 1);
        const buffer = 3;

        // 2A. User scrolled all the way to the left
        if (currentScroll <= buffer) {
          // Freeze dot syncing so that it doesn't get confused
          isTeleporting = true;

          // Set currentCardIndex to the index of the last non-clone card, then scroll to that position
          currentCardIndex = testimonials.length;
          carouselTrack.scrollTo({
            left: getScrollPosition(currentCardIndex),
            behavior: "auto",
          });

          // Unfreeze dot syncing
          isTeleporting = false;
        }

        // 2B. User scrolled all the way to the right
        else if (currentScroll >= maxScrollLeft - buffer) {
          // Freeze dot syncing
          isTeleporting = true;

          // Set currentCardIndex to the index of the first non-clode card, then scroll to that position
          currentCardIndex = 1;
          carouselTrack.scrollTo({
            left: getScrollPosition(currentCardIndex),
            behavior: "auto",
          });

          // Unfreeze dot syncing
          isTeleporting = false;
        }
      }, 20);
    });
  }

  // --- Execution ---
  await populateCarousel();
  populateIndicators();
  createScrollClones();
  setInitialPosition();
  initDotNavigation();
  initScrollListeners();
}

document.addEventListener("DOMContentLoaded", async () => {
  initMobileMenu();
  initSignupForm();
  await initCarousel();
});

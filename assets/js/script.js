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
  const carouselTrack = document.getElementById("carousel-track");
  const carouselIndicators = document.getElementById("carousel-indicators");

  let testimonials;

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
    const startIndex = 0;

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

  // Handle slider interactivity
  function setupSlider() {
    const cards = carouselTrack.querySelectorAll(".carousel-card");
    const dots = carouselIndicators.querySelectorAll(".carousel-dot");

    if (cards.length === 0) return;

    // Handle indicator clicks
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // Matches Tailwind's gap-6

        carouselTrack.scrollTo({
          left: index * (cardWidth + gap),
          behavior: "smooth",
        });
      });
    });

    // Handle swiping
    const observerOptions = {
      root: carouselTrack,
      threshold: 0.6, // Card must be 60% visible to activate its dot
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const activeIndex = Array.from(cards).indexOf(entry.target);
          dots.forEach((dot, dotIndex) => {
            dot.setAttribute(
              "aria-selected",
              dotIndex === activeIndex ? "true" : "false",
            );
          });
        }
      });
    }, observerOptions);

    cards.forEach((card) => observer.observe(card));
  }

  // --- Execution ---
  await populateCarousel();
  populateIndicators();
  setupSlider();
}

document.addEventListener("DOMContentLoaded", async () => {
  initMobileMenu();
  initSignupForm();
  await initCarousel();
});

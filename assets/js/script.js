//
// MOBILE MENU
//
function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const mobileMenu = document.getElementById("mobile-menu");

  // --- Function Definitions ---

  //   Helper Function: Visibly open/close mobile menu
  function toggleMenu() {
    // Check state of menu
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    const shouldOpen = !isOpen;

    // Update aria-expanded attribute
    menuBtn.setAttribute("aria-expanded", String(shouldOpen));

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

  //   Helper Function: Handle focus trap for mobile menu
  function handleFocusTrap(e) {
    // Close menu and remove focus trap if Escape key is pressed
    if (e.key === "Escape") {
      toggleMenu();
      document.removeEventListener("keydown", handleFocusTrap);
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
    const isOpen = toggleMenu();

    if (isOpen) {
      document.addEventListener("keydown", handleFocusTrap);
      menuBtn.focus();
    } else {
      document.removeEventListener("keydown", handleFocusTrap);
    }
  });

  // Close menu on backdrop click
  menuBackdrop.addEventListener("click", () => {
    toggleMenu();
    document.removeEventListener("keydown", handleFocusTrap);
  });
}

initMobileMenu();

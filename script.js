// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ====================================
  // Initialize all functionality
  // ====================================

  initBackgroundSlider();
  initTestimonialsCarousel();
  initContactForm();
  initServiceCards();
  initModals();
  initSmoothScroll();
  initScrollAnimations();
  initLazyLoading();
  initMobileMenu();
  initConsultationButtons();

  // ====================================
  // Background Slider Functionality
  // ====================================
  function initBackgroundSlider() {
    const backgroundSlides = document.querySelectorAll(".background-slide");
    let currentSlide = 0;

    function nextSlide() {
      backgroundSlides[currentSlide].classList.remove("active");
      currentSlide = (currentSlide + 1) % backgroundSlides.length;
      backgroundSlides[currentSlide].classList.add("active");
    }

    if (backgroundSlides.length > 0) {
      backgroundSlides[0].classList.add("active");
      setInterval(nextSlide, 5000);
    }
  }

  // ====================================
  // Testimonials Carousel
  // ====================================
  function initTestimonialsCarousel() {
    const reviewCarousel = document.querySelector("#reviewCarousel");
    if (!reviewCarousel) return;

    const carousel = new bootstrap.Carousel(reviewCarousel, {
      interval: 3000,
      wrap: true,
      keyboard: true,
      pause: "hover",
    });

    let touchStartX = 0;
    let touchEndX = 0;

    reviewCarousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    reviewCarousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      false
    );

    function handleSwipe() {
      if (touchEndX < touchStartX) carousel.next();
      if (touchEndX > touchStartX) carousel.prev();
    }
  }

  // ====================================
  // Contact Form
  // ====================================
  function initContactForm() {
    const contactForm = document.querySelector("#contactForm");
    if (!contactForm) return;

    const validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s'-]+$/,
        message: "Please enter a valid name",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
      phone: {
        required: false,
        pattern: /^[\d\s()+-.]+$/,
        message: "Please enter a valid phone number",
      },
      message: {
        required: true,
        minLength: 10,
        message: "Please enter a message (minimum 10 characters)",
      },
    };

    // Real-time validation
    Object.keys(validationRules).forEach((fieldName) => {
      const input = contactForm.querySelector(`[name="${fieldName}"]`);
      if (!input) return;

      input.addEventListener(
        "input",
        debounce(function (e) {
          validateField(input, validationRules[fieldName]);
        }, 300)
      );

      input.addEventListener("blur", function (e) {
        validateField(input, validationRules[fieldName]);
      });
    });

    // Form submission
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      let isValid = true;

      Object.keys(validationRules).forEach((fieldName) => {
        const input = this.querySelector(`[name="${fieldName}"]`);
        if (input) {
          isValid = validateField(input, validationRules[fieldName]) && isValid;
        }
      });

      if (isValid) {
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        try {
          // Disable the submit button and show loading state
          submitButton.disabled = true;
          submitButton.textContent = "Sending...";

          const response = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.success) {
            showMessage(
              "Thank you for your message. We will get back to you soon!",
              "success"
            );
            this.reset();
          } else {
            throw new Error(result.message || "Failed to send message");
          }
        } catch (error) {
          console.error("Error:", error);
          showMessage(
            "Sorry, there was a problem sending your message. Please try again later or contact us directly.",
            "error"
          );
        } finally {
          // Re-enable the submit button and restore original text
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  // Form helper functions
  function validateField(input, rules) {
    const value = input.value.trim();
    let isValid = true;
    let message = "";

    const existingMessage = input.parentElement.querySelector(
      ".validation-message"
    );
    if (existingMessage) existingMessage.remove();

    if (rules.required && !value) {
      isValid = false;
      message = `This field is required`;
    } else if (rules.minLength && value.length < rules.minLength) {
      isValid = false;
      message = `Minimum ${rules.minLength} characters required`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      isValid = false;
      message = rules.message;
    }

    input.classList.remove("is-valid", "is-invalid");
    input.classList.add(isValid ? "is-valid" : "is-invalid");

    if (!isValid) {
      const messageElement = document.createElement("div");
      messageElement.className = "validation-message error";
      messageElement.textContent = message;
      input.parentElement.appendChild(messageElement);
    }

    return isValid;
  }

  function showMessage(message, type) {
    const messageContainer = document.createElement("div");
    messageContainer.className = `alert alert-${type}`;
    messageContainer.textContent = message;
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
      contactForm.insertAdjacentElement("beforebegin", messageContainer);
      setTimeout(() => messageContainer.remove(), 5000);
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ====================================
  // Service Cards
  // ====================================
  function initServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
      // Hover animation
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
      });

      // Learn more button handling
      const learnMoreBtn = card.querySelector(".learn-more-btn");
      if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const serviceName = card.querySelector("h3").textContent;
          alert(`More information about ${serviceName} coming soon!`);
        });
      }
    });
  }

  // ====================================
  // Modals
  // ====================================
  function initModals() {
    const serviceCards = document.querySelectorAll(".service-card");
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    function openModal(modalId) {
      const modal = document.getElementById(modalId + "-modal");
      if (modal) {
        modal.style.display = "flex";
        modal.classList.add("active");
        modal.style.visibility = "visible";
        modal.style.opacity = "1";
        document.body.style.overflow = "hidden";
      }
    }

    function closeModal(modal) {
      modal.style.display = "none";
      modal.classList.remove("active");
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      document.body.style.overflow = "";
    }

    // Add click event to service cards
    serviceCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        e.preventDefault();
        const modalId = this.getAttribute("modal");
        openModal(modalId);
      });
    });

    // Close button functionality
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal");
        closeModal(modal);
      });
    });

    // Click outside to close
    modals.forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          closeModal(this);
        }
      });
    });

    // Close with Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        modals.forEach((modal) => {
          if (modal.style.display === "flex") {
            closeModal(modal);
          }
        });
      }
    });
  }

  // ====================================
  // Smooth Scroll
  // ====================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // ====================================
  // Scroll Animations
  // ====================================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".section").forEach((section) => {
      observer.observe(section);
    });
  }

  // ====================================
  // Lazy Loading
  // ====================================
  function initLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  // ====================================
  // Mobile Menu
  // ====================================
  function initMobileMenu() {
    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        mobileMenuButton.setAttribute(
          "aria-expanded",
          mobileMenu.classList.contains("active")
        );
      });

      document.addEventListener("click", (e) => {
        if (
          !mobileMenu.contains(e.target) &&
          !mobileMenuButton.contains(e.target)
        ) {
          mobileMenu.classList.remove("active");
          mobileMenuButton.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  // ====================================
  // Consultation Buttons
  // ====================================
  function initConsultationButtons() {
    const consultationButtons = document.querySelectorAll(
      '.hero-cta a, .services-cta a, a[href*="#contact"]'
    );

    consultationButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const contactSection = document.querySelector(".contact.section");

        if (contactSection) {
          contactSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          const firstInput = contactSection.querySelector("input, textarea");
          if (firstInput) {
            firstInput.focus();
          }
        }
      });
    });
  }
});

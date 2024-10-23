// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // ====================================
  // Background Slider Functionality
  // ====================================
  const backgroundSlides = document.querySelectorAll(".background-slide");
  let currentSlide = 0;

  function nextSlide() {
    // Remove active class from current slide
    backgroundSlides[currentSlide].classList.remove("active");
    // Calculate next slide index
    currentSlide = (currentSlide + 1) % backgroundSlides.length;
    // Add active class to next slide
    backgroundSlides[currentSlide].classList.add("active");
  }

  // Set initial slide
  if (backgroundSlides.length > 0) {
    backgroundSlides[0].classList.add("active");
    // Change background every 5 seconds
    setInterval(nextSlide, 5000);
  }

  // ====================================
  // Testimonials Carousel
  // ====================================
  const reviewCarousel = document.querySelector("#reviewCarousel");
  if (reviewCarousel) {
    const carousel = new bootstrap.Carousel(reviewCarousel, {
      interval: 3000,
      wrap: true,
      keyboard: true,
      pause: "hover",
    });

    // Add swipe support for mobile devices
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
      if (touchEndX < touchStartX) {
        carousel.next();
      }
      if (touchEndX > touchStartX) {
        carousel.prev();
      }
    }
  }

   // Services Section Interaction
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    // Add hover animation
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
    
    // Add click handler for learn more buttons
    const learnMoreBtn = card.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
      learnMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const serviceName = card.querySelector('h3').textContent;
        // You can customize this to show more information about the service
        alert(`More information about ${serviceName} coming soon!`);
      });
    }
  });

  // Add click handler for consultation button
  const consultationBtn = document.querySelector('.consultation-btn');
  if (consultationBtn) {
    consultationBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Scroll to contact form
      const contactSection = document.querySelector('.contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

  // ====================================
  // Smooth Scroll Navigation
  // ====================================
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

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ====================================
  // Scroll Animations
  // ====================================
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

  // Observe all sections for fade-in animation
  document.querySelectorAll(".section").forEach((section) => {
    observer.observe(section);
  });

  // ====================================
  // Contact Form Handling
  // ====================================
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const formEntries = Object.fromEntries(formData);

      // Basic form validation
      let isValid = true;
      let errorMessage = "";

      // Required fields validation
      const requiredFields = ["name", "email", "message"];
      requiredFields.forEach((field) => {
        const value = formEntries[field]?.trim();
        if (!value) {
          isValid = false;
          errorMessage += `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required.\n`;
        }
      });

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formEntries.email && !emailRegex.test(formEntries.email)) {
        isValid = false;
        errorMessage += "Please enter a valid email address.\n";
      }

      if (!isValid) {
        alert(errorMessage);
        return;
      }

      // If validation passes, you can handle the form submission here
      // For example, send to a server or API endpoint
      console.log("Form submitted:", formEntries);

      // Show success message
      alert("Thank you for your message. We will get back to you soon!");

      // Reset form
      this.reset();
    });
  }

  // ====================================
  // Service Cards Interaction
  // ====================================
  const serviceCards = document.querySelectorAll(".services li");
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.transition = "transform 0.3s ease";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // ====================================
  // Performance Optimizations
  // ====================================
  // Lazy load images
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

  // ====================================
  // Mobile Menu Handling
  // ====================================
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

    // Close mobile menu when clicking outside
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

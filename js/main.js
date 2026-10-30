/**
 * Zen Hospital - Mayo Clinic-Inspired Health Information Website
 * Main JavaScript File: js/main.js
 * Comprehensive Vanilla JavaScript (ES6+)
 * 
 * Features:
 *  1. Mobile Navigation Toggle & Backdrop Management
 *  2. Sticky Header (with .scrolled class past 100px)
 *  3. Search Overlay & Drawer Expansion
 *  4. Mega Menu (Desktop Hover & Mobile Accordion Toggle)
 *  5. Accessible Accordion Component (Smooth height animation & ARIA)
 *  6. A-Z Medical Index Filter (with smooth fade)
 *  7. Smooth Anchor Scrolling with Sticky Header Offset
 *  8. Form Validation (Appointments & Contact Forms)
 *  9. Newsletter Signup Validation & Feedback
 * 10. Back to Top Floating Button
 * 11. Sidebar Navigation Active State (Intersection Observer / ScrollSpy)
 * 12. Tab Component (ARIA keyboard arrow navigation)
 * 13. Lazy Loading Images (Intersection Observer)
 * 14. Accessibility Utilities (Focus trap, keyboard menu nav, skip-link)
 * 15. Additional Utilities (Share & Print helpers, live search filter)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initSearch();
  initMegaMenu();
  initAccordions();
  initAZFilter();
  initSearchFilter();
  initSmoothScroll();
  initFormValidation();
  initNewsletter();
  initBackToTop();
  initSidebarActiveState();
  initTabs();
  initLazyLoading();
  initAccessibilityEnhancements();
  initShareAndPrint();
});

/* ==========================================================================
   1. Mobile Navigation Toggle
   - Hamburger toggle button
   - Backdrop overlay
   - Close on outside click
   - Close on Escape key
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle, .mobile-nav-toggle, #mobileMenuToggle');
  const mainNav = document.querySelector('.main-nav, #mainNav');
  let navBackdrop = document.querySelector('.nav-backdrop, .nav-overlay, #navBackdrop');

  if (!toggleBtn || !mainNav) return;

  // Create backdrop if not already in markup
  if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    navBackdrop.id = 'navBackdrop';
    document.body.appendChild(navBackdrop);
  }

  function openMenu() {
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.classList.add('active', 'is-active');
    mainNav.classList.add('active', 'nav-open', 'is-open');
    navBackdrop.classList.add('active', 'is-visible');
    document.body.classList.add('nav-locked');

    // Switch icon if Font Awesome icon exists
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }

    // Set focus on first interactive nav element
    const firstLink = mainNav.querySelector('a, button');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 100);
    }
  }

  function closeMenu() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.classList.remove('active', 'is-active');
    mainNav.classList.remove('active', 'nav-open', 'is-open');
    navBackdrop.classList.remove('active', 'is-visible');
    document.body.classList.remove('nav-locked');

    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }

    // Collapse any opened mobile submenus
    const openSubmenus = mainNav.querySelectorAll('.nav-item.mobile-open, .nav-item-dropdown.is-open');
    openSubmenus.forEach(item => {
      item.classList.remove('mobile-open', 'is-open');
      const subToggle = item.querySelector('.dropdown-toggle, .nav-link');
      if (subToggle) subToggle.setAttribute('aria-expanded', 'false');
    });
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking the backdrop
  navBackdrop.addEventListener('click', closeMenu);

  // Close when clicking outside of nav and toggle
  document.addEventListener('click', (e) => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    if (isExpanded && !mainNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggleBtn.focus();
    }
  });

  // Close mobile nav on resize past breakpoint (> 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && toggleBtn.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
}

/* ==========================================================================
   2. Sticky Header
   - Adds 'scrolled' class when scrolled past 100px for shadow/shrink effect
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header, .site-header, header');
  if (!header) return;

  const threshold = 100;
  let ticking = false;

  function onScroll() {
    if (window.scrollY > threshold) {
      if (!header.classList.contains('scrolled')) {
        header.classList.add('scrolled');
      }
    } else {
      if (header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
      }
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
}

/* ==========================================================================
   3. Search Functionality
   - Toggle search overlay/expansion drawer when search icon clicked
   - Search form submission handler (prevents default, alerts search term)
   - Trap focus, close on Escape and outside click
   ========================================================================== */
function initSearch() {
  const searchToggles = document.querySelectorAll('.header-search-toggle, .search-toggle, #searchToggle, [data-search-trigger]');
  const searchDrawer = document.querySelector('.header-search-bar-drawer, .search-overlay, #searchOverlay, #searchDrawer');
  const searchForms = document.querySelectorAll('.header-search-form, .search-form, .hero-search-form, #searchForm');
  const searchCloseBtns = document.querySelectorAll('.search-close, #searchClose, [data-search-close]');
  let previousActiveElement = null;

  if (searchToggles.length && searchDrawer) {
    function openSearch() {
      previousActiveElement = document.activeElement;
      searchDrawer.classList.add('active', 'is-active');
      searchDrawer.setAttribute('aria-hidden', 'false');

      const searchInput = searchDrawer.querySelector('input[type="search"], input[type="text"]');
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus();
          searchInput.select();
        }, 150);
      }
    }

    function closeSearch() {
      searchDrawer.classList.remove('active', 'is-active');
      searchDrawer.setAttribute('aria-hidden', 'true');

      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }

    searchToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = searchDrawer.classList.contains('active') || searchDrawer.classList.contains('is-active');
        if (isOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      });
    });

    searchCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSearch();
      });
    });

    // Close on backdrop click (if overlay layout)
    searchDrawer.addEventListener('click', (e) => {
      if (e.target === searchDrawer) {
        closeSearch();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (searchDrawer.classList.contains('active') || searchDrawer.classList.contains('is-active'))) {
        closeSearch();
      }
    });

    // Focus trap inside search drawer/overlay
    searchDrawer.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        trapFocus(searchDrawer, e);
      }
    });
  }

  // Search forms submit handler
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"], input[type="text"]');
      const term = input ? input.value.trim() : '';

      if (!term) {
        if (input) {
          input.focus();
          input.classList.add('is-invalid');
          setTimeout(() => input.classList.remove('is-invalid'), 1200);
        }
        return;
      }

      // Mayo Clinic-style health database query confirmation
      alert(`Searching Zen Hospital Medical Database for: "${term}"`);

      // Close drawer if open
      if (searchDrawer) {
        searchDrawer.classList.remove('active', 'is-active');
        searchDrawer.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

/* ==========================================================================
   4. Mega Menu
   - Show/hide dropdowns on hover (desktop > 1024px)
   - Toggle on click (mobile <= 1023px)
   - Close when clicking outside & keyboard Escape
   ========================================================================== */
function initMegaMenu() {
  const menuItems = document.querySelectorAll('.has-mega-menu, .nav-item-dropdown, .nav-item');

  menuItems.forEach(item => {
    const toggle = item.querySelector('.nav-link, .dropdown-toggle');
    const megaMenu = item.querySelector('.mega-menu, .dropdown-menu');

    if (!toggle || !megaMenu) return;

    // Desktop hover handling
    let hoverTimeout;
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 1024) {
        clearTimeout(hoverTimeout);
        closeOtherMegaMenus(item);
        item.classList.add('is-open');
        megaMenu.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        hoverTimeout = setTimeout(() => {
          item.classList.remove('is-open');
          megaMenu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }, 150);
      }
    });

    // Mobile click handling
    toggle.addEventListener('click', (e) => {
      if (window.innerWidth < 1024) {
        // If it has a submenu, toggle it instead of navigating
        if (megaMenu) {
          e.preventDefault();
          const isOpen = item.classList.contains('mobile-open') || item.classList.contains('is-open');

          if (isOpen) {
            item.classList.remove('mobile-open', 'is-open');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            closeOtherMegaMenus(item);
            item.classList.add('mobile-open', 'is-open');
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      }
    });

    // Keyboard support
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        item.classList.remove('is-open', 'mobile-open');
        megaMenu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-mega-menu, .nav-item')) {
      closeOtherMegaMenus(null);
    }
  });

  function closeOtherMegaMenus(currentItem) {
    menuItems.forEach(other => {
      if (other !== currentItem) {
        other.classList.remove('is-open', 'mobile-open');
        const otherMenu = other.querySelector('.mega-menu, .dropdown-menu');
        const otherToggle = other.querySelector('.nav-link, .dropdown-toggle');
        if (otherMenu) otherMenu.classList.remove('is-open');
        if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   5. Accordion Component
   - Click to expand/collapse accordion panels
   - Only one panel open at a time within a group
   - Smooth height animation with scrollHeight
   - ARIA expanded state toggling
   ========================================================================== */
function initAccordions() {
  const accordionGroups = document.querySelectorAll('.accordion, .faq-accordion, .accordion-container, [data-accordion-group]');

  // Initialize individual groups
  if (accordionGroups.length > 0) {
    accordionGroups.forEach(group => setupAccordionGroup(group));
  } else {
    // Fallback: look for stand-alone accordion items
    const standaloneItems = document.querySelectorAll('.accordion-item');
    if (standaloneItems.length > 0) {
      setupAccordionGroup(document.body);
    }
  }

  function setupAccordionGroup(group) {
    const items = group.querySelectorAll('.accordion-item');

    items.forEach(item => {
      const trigger = item.querySelector('.accordion-header, .accordion-button, .accordion-trigger, [data-accordion-trigger]');
      const content = item.querySelector('.accordion-body, .accordion-content, .accordion-collapse, [data-accordion-panel]');

      if (!trigger || !content) return;

      const isInitiallyOpen = item.classList.contains('active') || item.classList.contains('is-active');
      trigger.setAttribute('aria-expanded', isInitiallyOpen ? 'true' : 'false');
      content.setAttribute('aria-hidden', isInitiallyOpen ? 'false' : 'true');

      if (isInitiallyOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0px';
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // Close other panels in this group
        items.forEach(other => {
          if (other !== item) {
            const otherTrigger = other.querySelector('.accordion-header, .accordion-button, .accordion-trigger, [data-accordion-trigger]');
            const otherContent = other.querySelector('.accordion-body, .accordion-content, .accordion-collapse, [data-accordion-panel]');

            if (otherTrigger && otherContent) {
              other.classList.remove('active', 'is-active');
              otherTrigger.setAttribute('aria-expanded', 'false');
              otherContent.setAttribute('aria-hidden', 'true');
              otherContent.style.maxHeight = '0px';
              otherContent.classList.add('collapsed');
            }
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active', 'is-active');
          trigger.setAttribute('aria-expanded', 'false');
          content.setAttribute('aria-hidden', 'true');
          content.style.maxHeight = '0px';
          content.classList.add('collapsed');
        } else {
          item.classList.add('active', 'is-active');
          trigger.setAttribute('aria-expanded', 'true');
          content.setAttribute('aria-hidden', 'false');
          content.classList.remove('collapsed');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });

      // Maintain flexible height when window resizes
      content.addEventListener('transitionend', () => {
        if (trigger.getAttribute('aria-expanded') === 'true') {
          content.style.maxHeight = 'none';
        }
      });

      trigger.addEventListener('mousedown', () => {
        if (trigger.getAttribute('aria-expanded') === 'true' && content.style.maxHeight === 'none') {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  // Support for optional "Expand All / Collapse All" button if present
  const toggleAllBtn = document.getElementById('toggleAllAccordionsBtn');
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      const allItems = document.querySelectorAll('.accordion-item');
      const isAllExpanded = toggleAllBtn.getAttribute('data-state') === 'expanded';

      allItems.forEach(item => {
        const trigger = item.querySelector('.accordion-header, .accordion-trigger');
        const content = item.querySelector('.accordion-body, .accordion-content');
        if (!trigger || !content) return;

        if (isAllExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          content.style.maxHeight = '0px';
          item.classList.remove('active');
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          content.style.maxHeight = content.scrollHeight + 'px';
          item.classList.add('active');
        }
      });

      if (isAllExpanded) {
        toggleAllBtn.setAttribute('data-state', 'collapsed');
        toggleAllBtn.innerHTML = '<i class="fa-solid fa-angles-down"></i> Expand All';
      } else {
        toggleAllBtn.setAttribute('data-state', 'expanded');
        toggleAllBtn.innerHTML = '<i class="fa-solid fa-angles-up"></i> Collapse All';
      }
    });
  }
}

/* ==========================================================================
   6. A-Z Filter
   - Click letter buttons to filter displayed items
   - "All" button to show everything
   - Smooth show/hide with fade effect
   ========================================================================== */
function initAZFilter() {
  const azButtons = document.querySelectorAll('.az-btn, [data-letter]');
  const items = document.querySelectorAll('[data-az-item], [data-letter-item], .az-item');
  const emptyState = document.getElementById('noResultsMsg') || document.querySelector('.az-empty-state');

  if (!azButtons.length || !items.length) return;

  azButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Update active state
      azButtons.forEach(b => {
        b.classList.remove('active', 'is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active', 'is-active');
      btn.setAttribute('aria-pressed', 'true');

      const selectedLetter = (btn.getAttribute('data-letter') || btn.textContent.trim()).toLowerCase();
      let visibleCount = 0;

      items.forEach(item => {
        const itemLetter = (item.getAttribute('data-letter') || 
                            item.getAttribute('data-letter-item') || 
                            item.textContent.trim().charAt(0)).toLowerCase();

        if (selectedLetter === 'all' || itemLetter === selectedLetter) {
          item.style.display = '';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
          visibleCount++;
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(8px)';
          setTimeout(() => {
            if (btn.classList.contains('active')) {
              item.style.display = 'none';
            }
          }, 200);
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });
}

/* ==========================================================================
   7. Live Search Filter Helper (Health Library search input)
   ========================================================================== */
function initSearchFilter() {
  const searchInput = document.getElementById('healthSearchInput');
  const items = document.querySelectorAll('[data-az-item], .az-item');
  const emptyState = document.getElementById('noResultsMsg') || document.querySelector('.az-empty-state');

  if (!searchInput || !items.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    // Reset A-Z button to "All" when typing
    const allBtn = document.querySelector('.az-btn[data-letter="all"]');
    if (allBtn && query.length > 0) {
      document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
      allBtn.classList.add('active');
    }

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(query)) {
        item.style.display = '';
        item.style.opacity = '1';
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.style.opacity = '0';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

/* ==========================================================================
   8. Smooth Scroll
   - Smooth scroll to anchor links
   - Offset calculation for sticky header
   ========================================================================== */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"]):not([data-toggle]):not([role="tab"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const header = document.querySelector('.main-header, .site-header, header');
      const headerHeight = header ? header.offsetHeight : 80;
      const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset;
      const offsetPos = targetTop - headerHeight - 16;

      window.scrollTo({
        top: offsetPos,
        behavior: 'smooth'
      });

      if (history.pushState) {
        history.pushState(null, null, targetId);
      }

      // Accessibility focus
      targetEl.setAttribute('tabindex', '-1');
      targetEl.focus({ preventScroll: true });
    });
  });
}

/* ==========================================================================
   9. Form Validation
   - Required fields check
   - Email format validation
   - Phone format validation
   - Inline error feedback
   - Success confirmation alert
   ========================================================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate], .contact-form, #contactForm, #appointmentForm, .appointment-form');

  forms.forEach(form => {
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach(input => {
      input.addEventListener('input', () => clearError(input));
      input.addEventListener('blur', () => validateField(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      requiredInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Show success feedback
      showSuccessFeedback(form);
    });
  });

  function validateField(input) {
    const val = input.value.trim();
    const type = input.getAttribute('type') || input.tagName.toLowerCase();
    let errorMsg = '';

    if (!val) {
      errorMsg = 'This field is required.';
    } else if (type === 'email' || input.name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (type === 'tel' || input.name === 'phone') {
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phoneRegex.test(val.replace(/\s+/g, ''))) {
        errorMsg = 'Please enter a valid phone number (e.g. 1-800-555-0199).';
      }
    }

    if (errorMsg) {
      setError(input, errorMsg);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  function setError(input, msg) {
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');

    let err = input.parentElement.querySelector('.invalid-feedback, .field-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error text-danger text-sm mt-1';
      err.id = `${input.id || input.name}-error`;
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
    input.setAttribute('aria-describedby', err.id);
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    const err = input.parentElement.querySelector('.invalid-feedback, .field-error');
    if (err) err.textContent = '';
  }

  function showSuccessFeedback(form) {
    let successBox = form.querySelector('.form-success-banner');
    if (!successBox) {
      successBox = document.createElement('div');
      successBox.className = 'form-success-banner alert alert-success p-3 rounded mb-4';
      successBox.setAttribute('role', 'alert');
      form.prepend(successBox);
    }

    const isAppt = form.id === 'appointmentForm' || form.classList.contains('appointment-form');
    const title = isAppt ? 'Appointment Request Confirmed!' : 'Message Received!';
    const text = isAppt 
      ? 'Thank you for reaching out. A Zen Hospital patient care coordinator will review your request and contact you within 24 business hours.'
      : 'Thank you for contacting Zen Hospital. A member of our clinical communications team will respond to your inquiry shortly.';

    successBox.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 14px; background: #ECFDF5; border: 1.5px solid #10B981; border-radius: 8px; padding: 1.25rem;">
        <i class="fa-solid fa-circle-check" style="color: #059669; font-size: 1.6rem; margin-top: 2px;"></i>
        <div>
          <h4 style="margin: 0 0 4px 0; color: #065F46; font-size: 1.1rem; font-weight: 700;">${title}</h4>
          <p style="margin: 0; color: #047857; font-size: 0.95rem; line-height: 1.45;">${text}</p>
        </div>
      </div>
    `;
    successBox.style.display = 'block';

    form.reset();
    successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   10. Newsletter Signup
   - Validate email
   - Show success/error message
   ========================================================================== */
function initNewsletter() {
  const newsletterForms = document.querySelectorAll('.newsletter-form, #newsletterForm, [data-newsletter]');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      let msg = form.querySelector('.newsletter-message');

      if (!msg) {
        msg = document.createElement('div');
        msg.className = 'newsletter-message text-sm mt-2';
        form.appendChild(msg);
      }

      if (!input) return;
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#DC2626';
        msg.style.display = 'block';
        input.focus();
        return;
      }

      msg.textContent = 'Thank you for subscribing to Zen Hospital updates!';
      msg.style.color = '#059669';
      msg.style.display = 'block';
      input.value = '';

      setTimeout(() => {
        msg.style.display = 'none';
      }, 6000);
    });
  });
}

/* ==========================================================================
   11. Back to Top Button
   - Show when scrolled past 500px
   - Smooth scroll to top on click
   ========================================================================== */
function initBackToTop() {
  let backBtn = document.querySelector('#backToTop, .back-to-top');

  if (!backBtn) {
    backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top of page');
    backBtn.setAttribute('title', 'Back to top');
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backBtn);
  }

  const threshold = 500;
  let isVisible = false;

  window.addEventListener('scroll', () => {
    if (window.scrollY > threshold) {
      if (!isVisible) {
        backBtn.classList.add('active', 'is-visible', 'show');
        backBtn.setAttribute('aria-hidden', 'false');
        isVisible = true;
      }
    } else {
      if (isVisible) {
        backBtn.classList.remove('active', 'is-visible', 'show');
        backBtn.setAttribute('aria-hidden', 'true');
        isVisible = false;
      }
    }
  }, { passive: true });

  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.focus();
    } else {
      document.body.focus();
    }
  });
}

/* ==========================================================================
   12. Sidebar Navigation Active State (Intersection Observer / ScrollSpy)
   ========================================================================== */
function initSidebarActiveState() {
  const sidebarLinks = document.querySelectorAll('.sidebar-menu-item a, .sidebar-nav a, .toc-link, [data-sidebar-link]');
  if (!sidebarLinks.length) return;

  const sectionIds = Array.from(sidebarLinks)
    .map(link => link.getAttribute('href'))
    .filter(href => href && href.startsWith('#') && href.length > 1);

  const sections = sectionIds
    .map(id => document.querySelector(id))
    .filter(sec => sec !== null);

  if (!sections.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = `#${entry.target.id}`;
          sidebarLinks.forEach(link => {
            const parentItem = link.closest('.sidebar-menu-item');
            if (link.getAttribute('href') === currentId) {
              link.classList.add('active');
              if (parentItem) parentItem.classList.add('active');
              link.setAttribute('aria-current', 'true');
            } else {
              link.classList.remove('active');
              if (parentItem) parentItem.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
  } else {
    // Scroll event fallback
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;
      let currentSection = sections[0];

      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= scrollPos) {
          currentSection = sections[i];
        }
      }

      sidebarLinks.forEach(link => {
        const parentItem = link.closest('.sidebar-menu-item');
        if (currentSection && link.getAttribute('href') === `#${currentSection.id}`) {
          link.classList.add('active');
          if (parentItem) parentItem.classList.add('active');
        } else {
          link.classList.remove('active');
          if (parentItem) parentItem.classList.remove('active');
        }
      });
    }, { passive: true });
  }
}

/* ==========================================================================
   13. Tab Component
   - Switch between tab panels
   - ARIA attributes & keyboard arrow navigation
   ========================================================================== */
function initTabs() {
  const tabContainers = document.querySelectorAll('.tabs-wrapper, [data-tabs], [role="tablist"]');

  tabContainers.forEach(container => {
    const tabList = container.hasAttribute('role') && container.getAttribute('role') === 'tablist' 
      ? container 
      : container.querySelector('[role="tablist"], .tab-nav, .nav-tabs');

    if (!tabList) return;

    const tabs = tabList.querySelectorAll('[role="tab"], .tab-btn, .nav-link');
    const panels = document.querySelectorAll('[role="tabpanel"], .tab-pane, .tab-content-panel');

    function activateTab(tab) {
      tabs.forEach(t => {
        t.classList.remove('active', 'is-active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      panels.forEach(p => {
        p.classList.remove('active', 'is-active', 'show');
        p.setAttribute('hidden', 'true');
      });

      tab.classList.add('active', 'is-active');
      tab.setAttribute('aria-selected', 'true');
      tab.removeAttribute('tabindex');

      const targetId = tab.getAttribute('data-tab-target') || 
                       tab.getAttribute('aria-controls') || 
                       tab.getAttribute('href');

      if (targetId) {
        const panel = document.querySelector(targetId);
        if (panel) {
          panel.classList.add('active', 'is-active', 'show');
          panel.removeAttribute('hidden');
        }
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        activateTab(tab);
      });

      tab.addEventListener('keydown', (e) => {
        let targetIdx = null;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetIdx = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetIdx = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIdx = tabs.length - 1;
        }

        if (targetIdx !== null) {
          tabs[targetIdx].focus();
          activateTab(tabs[targetIdx]);
        }
      });
    });
  });
}

/* ==========================================================================
   14. Lazy Loading Images
   - IntersectionObserver with fallback
   ========================================================================== */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src], img.lazy');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
          img.classList.add('is-loaded', 'loaded');
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px', threshold: 0.01 });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => {
      img.src = img.getAttribute('data-src');
      img.classList.add('is-loaded', 'loaded');
    });
  }
}

/* ==========================================================================
   15. Accessibility Utilities
   - Modal focus trap
   - Skip to content focus
   ========================================================================== */
function initAccessibilityEnhancements() {
  const skipLink = document.querySelector('.skip-link, #skipToContent');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const target = document.querySelector('#main-content, main, [role="main"]');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

function trapFocus(element, event) {
  const focusables = element.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === first) {
      last.focus();
      event.preventDefault();
    }
  } else {
    if (document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  }
}

/* ==========================================================================
   16. Share & Print Helpers
   ========================================================================== */
function initShareAndPrint() {
  const printBtns = document.querySelectorAll('.btn-print-page, [data-print]');
  const shareBtns = document.querySelectorAll('.btn-share-page, [data-share]');

  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  shareBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = window.location.href;
      const title = document.title;

      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (err) {
          copyUrl(url, btn);
        }
      } else {
        copyUrl(url, btn);
      }
    });
  });

  function copyUrl(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2000);
    }).catch(() => {
      alert('Page URL: ' + text);
    });
  }
}

/* ==========================================================================
   17. Tests, Drugs, Appointments & Locations Interactive Extensions
   ========================================================================== */
function initHealthPagesExtensions() {
  initTestsFilter();
  initDrugsFilter();
  initInteractionChecker();
  initLocationsMapPins();
}

/**
 * Filter engine for tests.html
 */
function initTestsFilter() {
  const searchInput = document.getElementById('testSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  const categoryPills = document.querySelectorAll('.filter-section .category-pill[data-category]');
  const azButtons = document.querySelectorAll('.az-filter-wrapper .az-btn[data-letter]');
  const cards = document.querySelectorAll('#testsGrid .test-card');
  const noResults = document.getElementById('noResults');
  const resetBtn = document.getElementById('resetFiltersBtn');
  const visibleCountEl = document.getElementById('visibleCount');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentLetter = 'all';
  let searchQuery = '';

  function filterCards() {
    let visible = 0;

    cards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardLetter = (card.getAttribute('data-letter') || '').toUpperCase();
      const cardText = card.textContent.toLowerCase();

      const matchCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchLetter = (currentLetter === 'all' || cardLetter === currentLetter);
      const matchSearch = (!searchQuery || cardText.includes(searchQuery));

      if (matchCategory && matchLetter && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visible;
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      filterCards();
    });
  }

  // Clear search
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.style.display = 'none';
      searchQuery = '';
      filterCards();
      if (searchInput) searchInput.focus();
    });
  }

  // Category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category').toLowerCase();
      filterCards();
    });
  });

  // A-Z filter buttons
  azButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      azButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLetter = (btn.getAttribute('data-letter') || 'all').toUpperCase();
      filterCards();
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      searchQuery = '';
      currentCategory = 'all';
      currentLetter = 'all';
      categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      azButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-letter') === 'all'));
      filterCards();
    });
  }
}

/**
 * Filter engine for drugs.html
 */
function initDrugsFilter() {
  const searchInput = document.getElementById('drugSearch');
  const clearBtn = document.getElementById('clearDrugSearchBtn');
  const categoryPills = document.querySelectorAll('.filter-section .category-pill[data-category]');
  const azButtons = document.querySelectorAll('.az-filter-wrapper .az-btn[data-letter]');
  const cards = document.querySelectorAll('#drugsGrid .drug-card');
  const noResults = document.getElementById('noDrugResults');
  const resetBtn = document.getElementById('resetDrugFiltersBtn');
  const visibleCountEl = document.getElementById('visibleDrugCount');

  if (!cards.length) return;

  let currentCategory = 'all';
  let currentLetter = 'all';
  let searchQuery = '';

  function filterCards() {
    let visible = 0;

    cards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardLetter = (card.getAttribute('data-letter') || '').toUpperCase();
      const cardText = card.textContent.toLowerCase();

      const matchCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchLetter = (currentLetter === 'all' || cardLetter === currentLetter);
      const matchSearch = (!searchQuery || cardText.includes(searchQuery));

      if (matchCategory && matchLetter && matchSearch) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleCountEl) visibleCountEl.textContent = visible;
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.toLowerCase().trim();
      if (clearBtn) clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      filterCards();
    });
  }

  // Clear search
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      clearBtn.style.display = 'none';
      searchQuery = '';
      filterCards();
      if (searchInput) searchInput.focus();
    });
  }

  // Category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.getAttribute('data-category').toLowerCase();
      filterCards();
    });
  });

  // A-Z filter buttons
  azButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      azButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLetter = (btn.getAttribute('data-letter') || 'all').toUpperCase();
      filterCards();
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      searchQuery = '';
      currentCategory = 'all';
      currentLetter = 'all';
      categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      azButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-letter') === 'all'));
      filterCards();
    });
  }
}

/**
 * Drug Interaction Checker UI in drugs.html
 */
function initInteractionChecker() {
  const checkBtn = document.getElementById('checkInteractionBtn');
  const drugSelect1 = document.getElementById('drugSelect1');
  const drugSelect2 = document.getElementById('drugSelect2');
  const resultBox = document.getElementById('checkerResultBox');
  const badgeEl = document.getElementById('resultSeverityBadge');
  const severityTextEl = document.getElementById('resultSeverityText');
  const titleEl = document.getElementById('resultDrugsTitle');
  const descEl = document.getElementById('resultDescription');

  if (!checkBtn || !drugSelect1 || !drugSelect2 || !resultBox) return;

  const interactionDatabase = {
    'lisinopril+ibuprofen': {
      severity: 'moderate',
      badgeClass: 'severity-moderate',
      text: 'Moderate Interaction',
      description: 'Co-administration of nonsteroidal anti-inflammatory drugs (NSAIDs) such as Ibuprofen may decrease the antihypertensive efficacy of ACE inhibitors like Lisinopril and increase the risk of renal function deterioration, especially in elderly or dehydrated patients.',
      advisory: 'Monitor blood pressure frequently. Consider non-NSAID alternatives such as Acetaminophen for mild pain under medical advice.'
    },
    'aspirin+ibuprofen': {
      severity: 'high',
      badgeClass: 'severity-high',
      text: 'Major Interaction',
      description: 'Concurrent use of multiple NSAIDs significantly escalates the risk of severe gastrointestinal ulceration, upper GI perforation, and bleeding. Ibuprofen may also interfere with the antiplatelet cardioprotective effect of low-dose Aspirin.',
      advisory: 'Avoid taking Ibuprofen and Aspirin together unless specifically supervised by your cardiologist. Space doses if co-administration is medically mandated.'
    },
    'amoxicillin+probiotic': {
      severity: 'minor',
      badgeClass: 'severity-minor',
      text: 'Minor Interaction / Timing Advisory',
      description: 'Antibacterial agents such as Amoxicillin can kill live probiotic cultures, reducing the probiotic supplement\'s therapeutic efficacy in supporting gut flora.',
      advisory: 'Administer oral probiotics at least 2 to 3 hours before or after your Amoxicillin dose to maximize probiotic survivability.'
    },
    'zinc+amoxicillin': {
      severity: 'moderate',
      badgeClass: 'severity-moderate',
      text: 'Moderate Interaction',
      description: 'Divalent and trivalent minerals such as Zinc can form insoluble chelation complexes with certain antibiotics in the GI tract, reducing antibiotic absorption and bloodstream concentrations.',
      advisory: 'Separate zinc supplements from antibiotic dosages by at least 2 hours.'
    },
    'metformin+ibuprofen': {
      severity: 'moderate',
      badgeClass: 'severity-moderate',
      text: 'Moderate Interaction',
      description: 'High-dose or prolonged NSAID therapy may transiently impair kidney filtration, which could increase systemic Metformin accumulation and theoretically elevate lactic acidosis vulnerability.',
      advisory: 'Ensure adequate hydration and discuss chronic analgesic use with your endocrinologist.'
    },
    'ashwagandha+melatonin': {
      severity: 'moderate',
      badgeClass: 'severity-moderate',
      text: 'Moderate Synergistic Effect',
      description: 'Both Ashwagandha and Melatonin exert central nervous system calming and sedating properties. Combining them may produce additive drowsiness or psychomotor slowing.',
      advisory: 'Exercise caution if operating vehicles or heavy machinery. Start with conservative doses at bedtime.'
    }
  };

  checkBtn.addEventListener('click', () => {
    const val1 = drugSelect1.value;
    const val2 = drugSelect2.value;

    if (!val1 || !val2) {
      alert('Please select both medications or supplements from the dropdown lists to run the check.');
      return;
    }

    if (val1 === val2) {
      resultBox.style.display = 'block';
      badgeEl.className = 'severity-indicator severity-minor';
      severityTextEl.textContent = 'Duplicate Selection';
      titleEl.textContent = 'Identical Substances Selected';
      descEl.textContent = 'You have selected the same substance for both fields. Please select two distinct medications or dietary supplements to evaluate cross-interactions.';
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    const pairKey1 = `${val1}+${val2}`;
    const pairKey2 = `${val2}+${val1}`;
    const interaction = interactionDatabase[pairKey1] || interactionDatabase[pairKey2];

    const label1 = drugSelect1.options[drugSelect1.selectedIndex].text.split('(')[0].trim();
    const label2 = drugSelect2.options[drugSelect2.selectedIndex].text.split('(')[0].trim();

    resultBox.style.display = 'block';
    titleEl.textContent = `${label1} + ${label2}`;

    if (interaction) {
      badgeEl.className = `severity-indicator ${interaction.badgeClass}`;
      severityTextEl.textContent = interaction.text;
      descEl.textContent = interaction.description;
      const advBox = resultBox.querySelector('.result-advisory');
      if (advBox) {
        advBox.innerHTML = `<i class="fa-solid fa-user-doctor" aria-hidden="true"></i> <strong>Clinical Guidance:</strong> ${interaction.advisory}`;
      }
    } else {
      badgeEl.className = 'severity-indicator severity-safe';
      severityTextEl.textContent = 'No Known Major Interaction';
      descEl.textContent = `No documented high-severity pharmacodynamic or pharmacokinetic interaction between ${label1} and ${label2} was identified in our standard clinical database at normal therapeutic dosages.`;
      const advBox = resultBox.querySelector('.result-advisory');
      if (advBox) {
        advBox.innerHTML = `<i class="fa-solid fa-user-doctor" aria-hidden="true"></i> <strong>Clinical Guidance:</strong> Always inform your prescribing doctor and pharmacist of all concurrent vitamins, supplements, and OTC drugs. Individual metabolic variations may apply.`;
      }
    }

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/**
 * Interactive map pin interaction in locations.html
 */
function initLocationsMapPins() {
  const pins = document.querySelectorAll('.map-placeholder .map-pin[data-location]');
  const cards = document.querySelectorAll('.locations-grid .location-card');

  if (!pins.length || !cards.length) return;

  const targetMapping = {
    'main': 'main-medical-center',
    'west': 'west-campus',
    'east': 'east-community-clinic',
    'north': 'north-urgent-care'
  };

  pins.forEach(pin => {
    pin.addEventListener('click', () => {
      pins.forEach(p => p.classList.remove('pin-active'));
      pin.classList.add('pin-active');

      const locKey = pin.getAttribute('data-location');
      const targetId = targetMapping[locKey];
      if (targetId) {
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.style.outline = '3px solid var(--primary-blue)';
          targetCard.style.outlineOffset = '4px';
          setTimeout(() => {
            targetCard.style.outline = 'none';
          }, 2500);
        }
      }
    });
  });
}

// Ensure execution on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHealthPagesExtensions);
} else {
  initHealthPagesExtensions();
}

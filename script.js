/**
 * script.js — Meeara HDPE Pipes
 * Author: Madhu Kiran Sai
 * 
 * This file handles all interactive functionality for the product page.
 * 
 * FEATURES IMPLEMENTED:
 * ---------------------
 * 1. Sticky header — shows/hides based on scroll position
 *    - Appears when scrolling beyond the first fold (past navbar)
 *    - Positioned above the navigation bar (z-index: 1000 vs 900)
 *    - Disappears when scrolling back up (smooth CSS transition)
 * 
 * 2. Product image carousel — prev/next + thumbnail clicks
 *    - Keyboard navigation support (left/right arrow keys)
 *    - Active state indication on thumbnails
 * 
 * 3. Carousel zoom preview — magnified view on hover
 *    - Shows enlarged preview positioned beside the gallery
 *    - Pans the zoomed image to match cursor position
 *    - Includes zoom lens overlay for visual feedback
 * 
 * 4. Mobile hamburger menu — toggle navigation on small screens
 * 5. Manufacturing process tabs — step-by-step workflow display
 * 6. Industries carousel — drag/click scroll + arrow buttons
 * 7. Modal popups — datasheet download and quote request forms
 * 8. Smooth scrolling — anchor link navigation with offset for sticky header
 *
 * BROWSER SUPPORT: Chrome, Firefox, Safari, Edge (ES5 compatible)
 */

// Run everything once DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {

  /* ================================================================
     1. STICKY BAR
     Watches scroll. Shows the sticky bar once the user scrolls
     past the main navbar height, hides it when scrolling back up.
  ================================================================ */
  var stickyBar  = document.getElementById('stickyBar');
  var mainNavbar = document.getElementById('mainNavbar');

  if (stickyBar && mainNavbar) {
    var navbarHeight = mainNavbar.offsetHeight;
    // Track last scroll position to detect direction
    var lastScrollY = window.scrollY;

    function handleScroll() {
      var currentY = window.scrollY;

      if (currentY > navbarHeight + 60) {
        // Show sticky bar only when scrolling down past fold
        stickyBar.classList.add('is-visible');
        stickyBar.setAttribute('aria-hidden', 'false');
      } else {
        stickyBar.classList.remove('is-visible');
        stickyBar.setAttribute('aria-hidden', 'true');
      }

      lastScrollY = currentY;
    }

    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load in case page is already scrolled
    handleScroll();
  }


  /* ================================================================
     2. PRODUCT IMAGE CAROUSEL
     Supports: thumbnail clicks, prev/next arrows, keyboard nav
  ================================================================ */
  var carouselImages = document.querySelectorAll('.carousel__img');
  var thumbButtons   = document.querySelectorAll('.carousel__thumb');
  var prevBtn        = document.getElementById('carouselPrev');
  var nextBtn        = document.getElementById('carouselNext');
  var activeIndex    = 0;

  function showSlide(index) {
    // Clamp index within bounds
    if (index < 0) index = carouselImages.length - 1;
    if (index >= carouselImages.length) index = 0;

    // Remove active from current image + thumb
    carouselImages[activeIndex].classList.remove('active');
    if (thumbButtons[activeIndex]) {
      thumbButtons[activeIndex].classList.remove('active');
    }

    activeIndex = index;

    // Add active to new image + thumb
    carouselImages[activeIndex].classList.add('active');
    if (thumbButtons[activeIndex]) {
      thumbButtons[activeIndex].classList.add('active');
    }

    // Update zoom preview source to match current slide
    var zoomImg = document.getElementById('zoomImg');
    if (zoomImg) {
      var currentSrc = carouselImages[activeIndex].src;
      zoomImg.src = currentSrc;
    }
  }

  // Prev / next arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      showSlide(activeIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      showSlide(activeIndex + 1);
    });
  }

  // Thumbnail clicks
  thumbButtons.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var idx = parseInt(this.getAttribute('data-index'), 10);
      showSlide(idx);
    });
  });

  // Keyboard left/right for accessibility
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  showSlide(activeIndex - 1);
    if (e.key === 'ArrowRight') showSlide(activeIndex + 1);
  });


  /* ================================================================
     3. CAROUSEL ZOOM PREVIEW
     On mouse enter/move over carousel main area:
       — shows a zoom icon cursor
       — shows enlarged preview on the right side
       — shifts the zoomed image to match cursor position
     On mouse leave: hides the preview
  ================================================================ */
  var carouselWrap  = document.querySelector('.carousel__main-wrap');
  var zoomPreview   = document.getElementById('zoomPreview');
  var zoomImg       = document.getElementById('zoomImg');
  var zoomIcon      = document.getElementById('zoomIcon');
  var zoomLens      = document.getElementById('zoomLens');

  if (carouselWrap && zoomPreview && zoomImg) {

    // Set initial zoom image source
    if (carouselImages.length > 0) {
      zoomImg.src = carouselImages[0].src;
    }

    carouselWrap.addEventListener('mouseenter', function () {
      // Update src in case slide changed
      zoomImg.src = carouselImages[activeIndex].src;
      zoomPreview.classList.add('is-visible');
      if (zoomIcon) zoomIcon.classList.add('is-visible');
      if (zoomLens) zoomLens.classList.add('is-visible');
    });

    carouselWrap.addEventListener('mouseleave', function () {
      zoomPreview.classList.remove('is-visible');
      if (zoomIcon) zoomIcon.classList.remove('is-visible');
      if (zoomLens) zoomLens.classList.remove('is-visible');
    });

    /*
      Track mouse position to pan the zoomed image.
      We calculate where the mouse is as a percentage within the wrap,
      then offset the zoom image accordingly so the area under the cursor
      is shown in the zoom box.
    */
    carouselWrap.addEventListener('mousemove', function (e) {
      var rect = carouselWrap.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var clampedX = Math.min(Math.max(x, 0), rect.width);
      var clampedY = Math.min(Math.max(y, 0), rect.height);

      // Update zoom icon position
      if (zoomIcon) {
        zoomIcon.style.left = clampedX + 'px';
        zoomIcon.style.top = clampedY + 'px';
      }

      var lensWidth = zoomLens ? zoomLens.offsetWidth : 120;
      var lensHeight = zoomLens ? zoomLens.offsetHeight : 120;
      var halfLensW = lensWidth / 2;
      var halfLensH = lensHeight / 2;

      var lensLeft = Math.min(Math.max(clampedX - halfLensW, 0), rect.width - lensWidth);
      var lensTop = Math.min(Math.max(clampedY - halfLensH, 0), rect.height - lensHeight);

      if (zoomLens) {
        zoomLens.style.left = (lensLeft + halfLensW) + 'px';
        zoomLens.style.top = (lensTop + halfLensH) + 'px';
      }

      var previewW = zoomPreview.clientWidth;
      var previewH = zoomPreview.clientHeight;

      var fx = clampedX / rect.width;
      var fy = clampedY / rect.height;

      var bgPosX = fx * 100;
      var bgPosY = fy * 100;

      zoomImg.style.width = '100%';
      zoomImg.style.height = '100%';
      zoomImg.style.objectFit = 'none';
      zoomImg.style.objectPosition = bgPosX + '% ' + bgPosY + '%';
    });
  }


  /* ================================================================
     4. MOBILE HAMBURGER MENU
  ================================================================ */
  var hamburger  = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    // Close menu when a link inside it is clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }


  /* ================================================================
     5. MANUFACTURING PROCESS TABS
     Clicking a tab shows its panel and hides the others.
  ================================================================ */
  var tabs   = document.querySelectorAll('.process-tab');
  var panels = document.querySelectorAll('.process-panel');

  // Also hook up prev/next inside the panel image
  var processPrev = document.getElementById('processPrev');
  var processNext = document.getElementById('processNext');
  var tabOrder    = [];

  // Build ordered list of tab keys
  tabs.forEach(function (tab) {
    tabOrder.push(tab.getAttribute('data-tab'));
  });

  function activateTab(tabKey) {
    tabs.forEach(function (t) {
      var isActive = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('active', p.id === 'tab-' + tabKey);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(this.getAttribute('data-tab'));
    });
  });

  // Prev / next arrows inside the panel
  if (processPrev) {
    processPrev.addEventListener('click', function () {
      var currentActive = document.querySelector('.process-tab.active');
      if (!currentActive) return;
      var currentKey = currentActive.getAttribute('data-tab');
      var idx = tabOrder.indexOf(currentKey);
      var prevIdx = (idx - 1 + tabOrder.length) % tabOrder.length;
      activateTab(tabOrder[prevIdx]);
    });
  }
  if (processNext) {
    processNext.addEventListener('click', function () {
      var currentActive = document.querySelector('.process-tab.active');
      if (!currentActive) return;
      var currentKey = currentActive.getAttribute('data-tab');
      var idx = tabOrder.indexOf(currentKey);
      var nextIdx = (idx + 1) % tabOrder.length;
      activateTab(tabOrder[nextIdx]);
    });
  }


  /* ================================================================
     6. INDUSTRIES CAROUSEL
     — Arrow buttons scroll the track left/right
     — Mouse drag to scroll (desktop)
     — Touch drag to scroll (mobile)
  ================================================================ */
  var indTrack = document.getElementById('industriesTrack');
  var indPrev  = document.getElementById('indPrev');
  var indNext  = document.getElementById('indNext');

  if (indTrack) {
    // How much to scroll per button click (one card width + gap)
    var SCROLL_AMOUNT = 276; // 260px card + 16px gap

    if (indPrev) {
      indPrev.addEventListener('click', function () {
        indTrack.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
      });
    }
    if (indNext) {
      indNext.addEventListener('click', function () {
        indTrack.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
      });
    }

    // --- Mouse drag scroll ---
    var isDragging  = false;
    var dragStartX  = 0;
    var scrollStart = 0;

    indTrack.addEventListener('mousedown', function (e) {
      isDragging  = true;
      dragStartX  = e.pageX;
      scrollStart = indTrack.scrollLeft;
      indTrack.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = e.pageX - dragStartX;
      indTrack.scrollLeft = scrollStart - dx;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
      indTrack.style.cursor = 'grab';
    });

    // --- Touch support ---
    var touchStartX   = 0;
    var touchScrollStart = 0;

    indTrack.addEventListener('touchstart', function (e) {
      touchStartX      = e.touches[0].pageX;
      touchScrollStart = indTrack.scrollLeft;
    }, { passive: true });

    indTrack.addEventListener('touchmove', function (e) {
      var dx = e.touches[0].pageX - touchStartX;
      indTrack.scrollLeft = touchScrollStart - dx;
    }, { passive: true });
  }

  // Make industries track scrollable with overflow
  // (the CSS uses flex with no overflow, we enable it here so JS can drive it)
  if (indTrack) {
    indTrack.style.overflowX = 'auto';
    indTrack.style.scrollbarWidth = 'none'; // Firefox
    // WebKit scrollbar hidden
    var styleTag = document.createElement('style');
    styleTag.textContent = '.industries-track::-webkit-scrollbar { display: none; }';
    document.head.appendChild(styleTag);
  }


  /* ================================================================
     7. SIMPLE FORM VALIDATION FEEDBACK
     Shows a brief inline message on submit.
  ================================================================ */
  function setupForm(formId, successMsg) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic required field check
      var requiredFields = form.querySelectorAll('[required]');
      var allFilled = true;
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          allFilled = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!allFilled) return;

      // Show success (simple — no library needed)
      var existing = form.querySelector('.form-success');
      if (existing) return; // already shown

      var msg = document.createElement('p');
      msg.className = 'form-success';
      msg.textContent = successMsg;
      msg.style.cssText = 'margin-top:10px;font-size:13px;color:#16a34a;font-weight:600;';
      form.appendChild(msg);

      // Reset after 4 seconds
      setTimeout(function () {
        form.reset();
        if (msg.parentNode) msg.parentNode.removeChild(msg);
      }, 4000);
    });
  }

  setupForm('contactForm',  'Thanks! We will get back to you within 24 hours.');
  setupForm('catalogueForm', 'Catalogue request sent! Check your email shortly.');


  /* ================================================================
     8. TECHNICAL DATASHEET POPUP
     Opens when "Download Full Technical Datasheet" is clicked.
  ================================================================ */
  var datasheetBtn = document.getElementById('datasheetBtn') || document.querySelector('.specs-download .btn');
  var datasheetModal = document.getElementById('datasheetModal');
  var datasheetModalClose = document.getElementById('datasheetModalClose');
  var datasheetModalForm = document.getElementById('datasheetModalForm');
  var datasheetEmail = document.getElementById('datasheetEmail');
  var datasheetSubmitBtn = document.getElementById('datasheetSubmitBtn');
  var datasheetModalSuccess = document.getElementById('datasheetModalSuccess');

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function syncDatasheetSubmitState() {
    if (!datasheetSubmitBtn || !datasheetEmail) return;
    var valid = isValidEmail((datasheetEmail.value || '').trim());
    datasheetSubmitBtn.disabled = !valid;
  }

  function openDatasheetModal() {
    if (!datasheetModal) return;
    datasheetModal.classList.add('is-open');
    datasheetModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    syncDatasheetSubmitState();
    if (datasheetEmail) datasheetEmail.focus();
  }

  function closeDatasheetModal() {
    if (!datasheetModal) return;
    datasheetModal.classList.remove('is-open');
    datasheetModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (datasheetModalForm) datasheetModalForm.reset();
    if (datasheetModalSuccess) datasheetModalSuccess.textContent = '';
    syncDatasheetSubmitState();
  }

  if (datasheetBtn) {
    datasheetBtn.addEventListener('click', function (e) {
      e.preventDefault();
      openDatasheetModal();
    });
  }

  if (datasheetModalClose) {
    datasheetModalClose.addEventListener('click', closeDatasheetModal);
  }

  if (datasheetModal) {
    datasheetModal.addEventListener('click', function (e) {
      if (e.target === datasheetModal) {
        closeDatasheetModal();
      }
    });
  }

  if (datasheetModalForm) {
    datasheetModalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!datasheetEmail || !isValidEmail((datasheetEmail.value || '').trim())) {
        return;
      }

      if (datasheetModalSuccess) {
        datasheetModalSuccess.textContent = 'Brochure request received. Please check your email.';
      }

      setTimeout(function () {
        closeDatasheetModal();
      }, 1200);
    });
  }

  if (datasheetEmail) {
    datasheetEmail.addEventListener('input', syncDatasheetSubmitState);
  }

  syncDatasheetSubmitState();

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && datasheetModal && datasheetModal.classList.contains('is-open')) {
      closeDatasheetModal();
    }
  });


  /* ================================================================
     9. REQUEST A QUOTE POPUP
     Opens when "Request a Quote" is clicked.
  ================================================================ */
  var requestQuoteBtn = document.getElementById('requestQuoteBtn');
  var quoteModal = document.getElementById('quoteModal');
  var quoteModalClose = document.getElementById('quoteModalClose');
  var quoteModalForm = document.getElementById('quoteModalForm');
  var quoteFullName = document.getElementById('quoteFullName');

  function openQuoteModal() {
    if (!quoteModal) return;
    quoteModal.classList.add('is-open');
    quoteModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (quoteFullName) quoteFullName.focus();
  }

  function closeQuoteModal() {
    if (!quoteModal) return;
    quoteModal.classList.remove('is-open');
    quoteModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (quoteModalForm) quoteModalForm.reset();
  }

  // Handle all links that point to #contact - open quote modal instead
  document.querySelectorAll('a[href="#contact"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openQuoteModal();
    });
  });

  if (quoteModalClose) {
    quoteModalClose.addEventListener('click', closeQuoteModal);
  }

  if (quoteModal) {
    quoteModal.addEventListener('click', function (e) {
      if (e.target === quoteModal) {
        closeQuoteModal();
      }
    });
  }

  if (quoteModalForm) {
    quoteModalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      closeQuoteModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('is-open')) {
      closeQuoteModal();
    }
  });


  /* ================================================================
     Utility: smooth scroll for anchor links
     (handles cases where CSS scroll-behavior isn't enough,
     e.g. when offset is needed to clear sticky header)
  ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      
      // Skip links that open modals instead of scrolling
      if (targetId === 'contact') return;
      
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      // Offset by sticky bar height (56px) + a bit of breathing room
      var offset = 72;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

});

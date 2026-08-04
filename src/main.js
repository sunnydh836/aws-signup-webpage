import './style.css';

// 1. Central Configuration Object
const signupConfig = {
  tutorialVideo: "/videos/aws-signup-tutorial.mp4",
  builderSignupUrl: "https://bit.ly/451BZiU",
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfHnQzeaX56u6QIu3oKkiXiZbL3uTO54hEYoTreuXvoJxSqqA/viewform?usp=publish-editor",
  coordinatorName: "sunny dhruv",
  contactNumber: "9759261540",
  whatsappUrl: "https://wa.me/9759261540",
  goodies: [
    "/goodies/pen.jpg",
    "/goodies/sticker.jpg"
  ]
};

// 2. DOM Elements Binding
document.addEventListener('DOMContentLoaded', () => {
  // Video Player elements
  const videoPlayer = document.getElementById('tutorial-video');
  const videoSource = document.getElementById('video-source');
  const videoFallback = document.getElementById('video-fallback');

  // Link Buttons
  const btnBuilderSignup = document.getElementById('btn-builder-signup');
  const btnGoogleForm = document.getElementById('btn-google-form');
  const btnWhatsapp = document.getElementById('btn-whatsapp');

  // Contact text
  const coordNameText = document.getElementById('coord-name');
  const coordPhoneText = document.getElementById('coord-phone');

  // Load config into DOM
  if (videoSource && videoPlayer) {
    videoSource.src = signupConfig.tutorialVideo;
    videoPlayer.load();

    // Fallback if video fails to load (offline or incorrect path)
    videoPlayer.addEventListener('error', () => {
      videoPlayer.classList.add('hidden');
      if (videoFallback) {
        videoFallback.classList.remove('hidden');
      }
    });
  }

  if (btnBuilderSignup) btnBuilderSignup.href = signupConfig.builderSignupUrl;
  if (btnGoogleForm) btnGoogleForm.href = signupConfig.googleFormUrl;
  if (btnWhatsapp) btnWhatsapp.href = signupConfig.whatsappUrl;

  if (coordNameText) coordNameText.textContent = signupConfig.coordinatorName;
  if (coordPhoneText) {
    // Make phone number look slightly styled but exact
    coordPhoneText.textContent = signupConfig.contactNumber;
  }

  // 3. Navigation and Progress Indicator Logic
  const steps = [
    { indicator: document.getElementById('step-ind-1'), card: document.getElementById('step-card-1') },
    { indicator: document.getElementById('step-ind-2'), card: document.getElementById('step-card-2') },
    { indicator: document.getElementById('step-ind-3'), card: document.getElementById('step-card-3') }
  ];

  // Helper function to set active step
  function setActiveStep(activeIndex) {
    steps.forEach((step, index) => {
      if (index === activeIndex) {
        step.indicator.classList.add('active');
        step.card.classList.add('active');
        // Add a highlight class for visual effect
        step.card.classList.add('highlight-glow');
        setTimeout(() => {
          step.card.classList.remove('highlight-glow');
        }, 1500);
      } else {
        step.indicator.classList.remove('active');
        step.card.classList.remove('active');
      }

      // Mark previous steps as completed
      if (index < activeIndex) {
        step.indicator.classList.add('completed');
      } else {
        step.indicator.classList.remove('completed');
      }
    });
  }

  // Handle clicking step indicator items
  steps.forEach((step, index) => {
    if (step.indicator) {
      step.indicator.addEventListener('click', () => {
        setActiveStep(index);
        step.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });

  // Handle "Next Step" buttons
  const nextButtons = document.querySelectorAll('.btn-next');
  nextButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const nextStepIndex = parseInt(button.getAttribute('data-next'), 10) - 1;
      if (nextStepIndex >= 0 && nextStepIndex < steps.length) {
        setActiveStep(nextStepIndex);
        steps[nextStepIndex].card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // 4. ScrollSpy: Automatically highlight steps on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px -10% -40% 0px', // Trigger when card is in upper-middle of viewport
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const stepNum = parseInt(id.replace('step-card-', ''), 10);
        if (!isNaN(stepNum)) {
          const index = stepNum - 1;
          
          // Update indicators but don't force class change on other cards to prevent breaking current interactions
          steps.forEach((step, idx) => {
            if (idx === index) {
              step.indicator.classList.add('active');
            } else {
              step.indicator.classList.remove('active');
            }
            if (idx < index) {
              step.indicator.classList.add('completed');
            } else {
              step.indicator.classList.remove('completed');
            }
          });
        }
      }
    });
  }, observerOptions);

  steps.forEach(step => {
    if (step.card) {
      observer.observe(step.card);
    }
  });

  // 5. Render Goodies Gallery dynamically from config
  const goodiesContainer = document.getElementById('goodies-gallery-container');
  if (goodiesContainer && signupConfig.goodies) {
    goodiesContainer.innerHTML = '';
    
    signupConfig.goodies.forEach(imagePath => {
      // Formulate a beautiful title based on path keywords
      let title = 'AWS Goodie';
      if (imagePath.includes('pen')) title = 'Official AWS Pen';
      else if (imagePath.includes('sticker')) title = 'Official AWS Stickers';
      else {
        const filename = imagePath.split('/').pop().split('.')[0];
        title = filename.charAt(0).toUpperCase() + filename.slice(1);
      }

      // Create grid card element
      const card = document.createElement('div');
      card.className = 'gallery-card';
      
      const imgContainer = document.createElement('div');
      imgContainer.className = 'gallery-img-container';
      
      const img = document.createElement('img');
      img.src = imagePath;
      img.alt = title;
      img.loading = 'lazy';
      
      // Fallback behavior when image cannot load
      img.addEventListener('error', () => {
        imgContainer.innerHTML = `
          <div class="gallery-img-fallback">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="fallback-icon">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Image Offline</span>
          </div>
        `;
        card.classList.add('is-offline');
      });

      imgContainer.appendChild(img);
      
      const info = document.createElement('div');
      info.className = 'gallery-info';
      info.innerHTML = `<h4>${title}</h4>`;

      card.appendChild(imgContainer);
      card.appendChild(info);

      // Lightbox click triggers
      card.addEventListener('click', () => {
        if (card.classList.contains('is-offline')) return;
        openLightbox(imagePath, title);
      });

      goodiesContainer.appendChild(card);
    });
  }

  // Lightbox functionality
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    if (lightboxModal && lightboxImg && lightboxCaption) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxCaption.textContent = alt;
      lightboxModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      document.body.style.overflow = ''; // Unlock background scrolling
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }
});

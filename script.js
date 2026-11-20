/* ==========================================================================
   Joel George & Dr. Riya Mary Mathew — Digital Wedding Card Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDoors();
  initScrollReveal();
  initDressCodeModal();
  initCalendarDownload();
  initRsvpForm();
  initPetalsCanvas();
  initAmbientMusic();
  initTimelinePearl();
});

/* --------------------------------------------------------------------------
   1. Opening Sage Green Doors
   -------------------------------------------------------------------------- */
let musicController = null;

function initDoors() {
  const doorOverlay = document.getElementById('door-overlay');
  if (!doorOverlay) return;

  // Strict scroll lock while doors are closed
  document.documentElement.classList.add('doors-locked');
  document.body.classList.add('doors-locked');

  const preventScroll = (e) => {
    if (document.body.classList.contains('doors-locked')) {
      e.preventDefault();
    }
  };
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });

  const openDoors = () => {
    if (doorOverlay.classList.contains('is-opening') || doorOverlay.classList.contains('is-opened')) return;
    doorOverlay.classList.add('is-opening');
    document.body.classList.remove('doors-locked');
    document.documentElement.classList.remove('doors-locked');

    if (musicController && !musicController.isPlaying()) {
      musicController.start();
    }

    // Immediately trigger reveals so landing page is active right as doors open
    window.dispatchEvent(new Event('scroll'));

    setTimeout(() => {
      doorOverlay.classList.add('is-opened');
      doorOverlay.style.display = 'none';
    }, 500);
  };

  doorOverlay.addEventListener('click', openDoors);
  doorOverlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDoors();
    }
  });
}

/* --------------------------------------------------------------------------
   2. Scroll Reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const sections = document.querySelectorAll('.reveal');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* --------------------------------------------------------------------------
   3. Dress Code Modal (Wedding & Reception Themes)
   -------------------------------------------------------------------------- */
const DRESS_CODE_DATA = {
  wedding: {
    eventLabel: 'WEDDING ·',
    men: {
      title: 'Men’s Wedding Attire',
      description:
        'White, beige, pastel green, pastel pink shirts, or kasavu jubbah paired with black, brown, grey, or kasavu pants.',
      swatchGroups: [
        {
          groupLabel: 'Shirts & Jubbah',
          swatches: [
            { label: 'White', hex: '#FFFFFF' },
            { label: 'Beige', hex: '#EDE4D2' },
            { label: 'Pastel Green', hex: '#A2C29D' },
            { label: 'Pastel Pink', hex: '#F6C6CF' },
            { label: 'Kasavu Gold', hex: '#D2B876' }
          ]
        },
        {
          groupLabel: 'Pants',
          swatches: [
            { label: 'Black', hex: '#232323' },
            { label: 'Brown', hex: '#5D4037' },
            { label: 'Grey', hex: '#757B82' },
            { label: 'Kasavu', hex: '#D2B876' }
          ]
        }
      ],
      swatches: [
        { label: 'White', hex: '#FFFFFF' },
        { label: 'Beige', hex: '#EDE4D2' },
        { label: 'Pastel Green', hex: '#A2C29D' },
        { label: 'Pastel Pink', hex: '#F6C6CF' },
        { label: 'Kasavu Gold', hex: '#D2B876' },
        { label: 'Black', hex: '#232323' },
        { label: 'Brown', hex: '#5D4037' },
        { label: 'Grey', hex: '#757B82' },
        { label: 'Kasavu', hex: '#D2B876' }
      ],
      tips: [
        'Shirts: White / beige / pastel green / pastel pink / kasavu jubbah',
        'Pants: Black / brown / grey / kasavu pants'
      ]
    },
    women: {
      title: 'Women’s Wedding Attire',
      description:
        'Graceful pastel pink, pastel green, beige, silver, mocha brown, or kasavu — sarees, kurtis, or gowns.',
      swatches: [
        { label: 'Pastel Pink', hex: '#F6C6CF' },
        { label: 'Pastel Green', hex: '#9BB293' },
        { label: 'Beige', hex: '#EDE4D2' },
        { label: 'Silver', hex: '#C5C9D0' },
        { label: 'Mocha Brown', hex: '#7B5844' },
        { label: 'Kasavu Gold', hex: '#C8AD67' }
      ],
      tips: [
        'Pastel pink / pastel green / beige / silver / mocha brown / kasavu',
        'Sarees / kurtis / gowns'
      ]
    },
    kids: {
      title: 'Kids’ Wedding Attire',
      // description:
      //   'Pastel shades in any colour — dress for girls, shorts and t-shirt for boys.',
      swatches: [
        { label: 'Pastel Pink', hex: '#F7CDD5' },
        { label: 'Soft Sage', hex: '#B5CBB0' },
        { label: 'Powder Blue', hex: '#B9D5E8' },
        { label: 'Pale Yellow', hex: '#FBEEAE' },
        { label: 'Cream', hex: '#FAF4E3' }
      ],
      tips: [
        'Girls: Dress / frocks in any pastel colour',
        'Boys: Shorts and t-shirt',
        'Any cheerful pastel shade of your choice'
      ]
    }
  },
  reception: {
    eventLabel: 'RECEPTION · 5 JAN · DARK SHADES',
    men: {
      title: 'Men’s Reception Attire',
      description: 'Sophisticated evening wear featuring dark shade shirts and pants.',
      swatches: [
        { label: 'Dark Navy', hex: '#162238' },
        { label: 'Black', hex: '#1C1C1C' },
        { label: 'Deep Maroon', hex: '#441420' },
        { label: 'Dark Grey', hex: '#373E47' }
      ],
      tips: [
        'Shirts: Dark shade shirt (navy, black, maroon, dark grey)',
        'Pants: Dark shade formal or semi-formal pants'
      ]
    },
    women: {
      title: 'Women’s Reception Attire',
      description:
        'Glamorous evening attire in rich dark shades — navy blue, red, black, maroon, or violet in any format.',
      swatches: [
        { label: 'Navy Blue', hex: '#14254B' },
        { label: 'Red', hex: '#991B1B' },
        { label: 'Black', hex: '#1C1C1C' },
        { label: 'Maroon', hex: '#4E1220' },
        { label: 'Violet', hex: '#431952' }
      ],
      tips: [
        'Colours: Navy blue / red / black / maroon / violet',
        'Format: Any format (sarees, kurtis, gowns, western formals, etc.)'
      ]
    },
    kids: {
      title: 'Kids’ Reception Attire',
      description: 'Smart evening partywear in any stylish dark shade.',
      swatches: [
        { label: 'Dark Navy', hex: '#1B2A47' },
        { label: 'Deep Maroon', hex: '#4E1624' },
        { label: 'Velvet Black', hex: '#1E1E1E' },
        { label: 'Deep Violet', hex: '#3B1B45' }
      ],
      tips: [
        'Any dark shade of your choice',
        'Evening party frocks, dark shirts, or stylish coordinates'
      ]
    }
  }
};

function initDressCodeModal() {
  const modal = document.getElementById('dresscode-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const roleLabelEl = document.getElementById('modal-role-label');
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-description');
  const swatchesEl = document.getElementById('modal-swatches');
  const tipsEl = document.getElementById('modal-tips');

  if (!modal) return;

  const openModal = (group, eventType = 'wedding') => {
    const eventData = DRESS_CODE_DATA[eventType] || DRESS_CODE_DATA.wedding;
    const data = eventData[group];
    if (!data) return;

    if (roleLabelEl && eventData.eventLabel) {
      roleLabelEl.textContent = eventData.eventLabel;
    }

    titleEl.textContent = data.title;
    descEl.textContent = data.description || '';

    if (data.swatchGroups && data.swatchGroups.length > 0) {
      swatchesEl.innerHTML = data.swatchGroups
        .map(
          (group) => `
        <div class="swatch-group">
          ${group.groupLabel ? `<div class="swatch-group-title"><span>${group.groupLabel}</span></div>` : ''}
          <div class="swatch-group-row">
            ${group.swatches
              .map(
                (s) => `
              <div class="swatch-item">
                <span class="swatch-dot" style="background:${s.hex}"></span>
                <span class="swatch-label">${s.label}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>`
        )
        .join('');
    } else {
      swatchesEl.innerHTML = (data.swatches || [])
        .map(
          (s) => `
        <div class="swatch-item">
          <span class="swatch-dot" style="background:${s.hex}"></span>
          <span class="swatch-label">${s.label}</span>
        </div>`
        )
        .join('');
    }

    tipsEl.innerHTML = data.tips.map((t) => `<li>${t}</li>`).join('');
    modal.classList.remove('hidden');
  };

  const closeModal = () => modal.classList.add('hidden');

  document.querySelectorAll('.dresscode-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const eventType =
        btn.dataset.event ||
        (btn.closest('#dresscode-reception') ? 'reception' : 'wedding');
      openModal(group, eventType);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

/* --------------------------------------------------------------------------
   4. Calendar (.ics) Download for Wedding & Reception
   -------------------------------------------------------------------------- */
function initCalendarDownload() {
  const btn = document.getElementById('download-ics-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//JoelAndRiya//WeddingInvitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:joel-riya-wedding-20270103@weddingcard',
      'DTSTAMP:20261112T090000Z',
      'DTSTART:20270103T050000Z',
      'DTEND:20270103T070000Z',
      "SUMMARY:Wedding — Joel George & Dr. Riya Mary Mathew",
      "LOCATION:St. Mary's Orthodox Church, Vazhathope",
      'DESCRIPTION:Wedding ceremony on Sunday, 3 January 2027 at 10:30 AM (IST).',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:joel-riya-reception-punalur-20270103@weddingcard',
      'DTSTAMP:20261112T090000Z',
      'DTSTART:20270103T070000Z',
      'DTEND:20270103T100000Z',
      'SUMMARY:Wedding Reception — Joel George & Dr. Riya Mary Mathew',
      'LOCATION:KG Convention Centre, Punalur',
      'DESCRIPTION:Reception on Sunday, 3 January 2027 at 12:30 PM (IST).',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Joel-and-Riya-Wedding.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

/* --------------------------------------------------------------------------
   5. Interactive RSVP Form & Google Sheets Connection
   -------------------------------------------------------------------------- */
// Once you deploy the Google Apps Script Web App, paste its URL below:
const GOOGLE_RSVP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxhZ6RLiBXAo-mqxyN5BwRw6GxQzqF_TV-4f_pSh-IBS_RmENiqj84sfGT-nWxGskr/exec';

function initRsvpForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  const nameInput = document.getElementById('rsvp-name');
  const radios = form.querySelectorAll('input[name="attendance"]');
  const noteText = document.getElementById('rsvp-note-text');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const statusMsg = document.getElementById('rsvp-status-message');
  const STORAGE_KEY = 'joel_riya_rsvp_choice_v2';
  const STORAGE_NAME_KEY = 'joel_riya_rsvp_name_v2';

  const updateMessage = (value) => {
    if (!noteText) return;
    if (value === 'coming') {
      noteText.textContent = 'We look forward to celebrating with you! ✨';
    } else {
      noteText.textContent = 'You will be dearly missed & in our prayers! 🤍';
    }
  };

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateMessage(radio.value);
    });
  });

  // Restore saved choice
  try {
    const savedName = localStorage.getItem(STORAGE_NAME_KEY);
    if (savedName && nameInput && !nameInput.value) {
      nameInput.value = savedName;
    }
    const savedChoice = localStorage.getItem(STORAGE_KEY);
    if (savedChoice) {
      const matchRadio = form.querySelector(`input[name="attendance"][value="${savedChoice}"]`);
      if (matchRadio) {
        matchRadio.checked = true;
        updateMessage(savedChoice);
      }
    }
  } catch { }

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : '';
    if (!name) {
      if (statusMsg) {
        statusMsg.className = 'rsvp-status error';
        statusMsg.textContent = 'Please enter your name before submitting.';
        statusMsg.classList.remove('hidden');
      }
      if (nameInput) nameInput.focus();
      return;
    }

    const selectedRadio = form.querySelector('input[name="attendance"]:checked');
    const attendance = selectedRadio ? selectedRadio.value : 'coming';

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      if (btnText) btnText.textContent = 'SUBMITTING...';
      if (btnSpinner) btnSpinner.classList.remove('hidden');
    }
    if (statusMsg) statusMsg.classList.add('hidden');

    try {
      localStorage.setItem(STORAGE_NAME_KEY, name);
      localStorage.setItem(STORAGE_KEY, attendance);
    } catch { }

    // Send to Google Sheets if Script URL is configured
    if (GOOGLE_RSVP_SCRIPT_URL && GOOGLE_RSVP_SCRIPT_URL.trim().length > 0) {
      try {
        const payload = new URLSearchParams();
        payload.append('name', name);
        payload.append('attendance', attendance);

        // Include query parameters for maximum Google Apps Script compatibility
        const requestUrl = new URL(GOOGLE_RSVP_SCRIPT_URL);
        requestUrl.searchParams.set('name', name);
        requestUrl.searchParams.set('attendance', attendance);

        await fetch(requestUrl.toString(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: payload.toString()
        });
      } catch (err) {
        console.error('Google Sheet RSVP submission error:', err);
      }
    }

    // Success response
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        if (btnText) btnText.textContent = 'RSVP SUBMITTED ✓';
        if (btnSpinner) btnSpinner.classList.add('hidden');
      }

      if (statusMsg) {
        statusMsg.className = 'rsvp-status success';
        if (attendance === 'coming') {
          statusMsg.innerHTML = `Thank you, <strong>${name}</strong>!<br/>We look forward to celebrating with you! ✨`;
        } else {
          statusMsg.innerHTML = `Thank you, <strong>${name}</strong>.<br/>You will be dearly missed & in our prayers! 🤍`;
        }
        statusMsg.classList.remove('hidden');
      }
    }, 600);
  });
}

/* --------------------------------------------------------------------------
   6. Ambient Floating Pale-Yellow & Sage Petals
   -------------------------------------------------------------------------- */
function initPetalsCanvas() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const colors = [
    'rgba(253, 243, 194, 0.65)',
    'rgba(255, 252, 230, 0.70)',
    'rgba(240, 218, 134, 0.52)'
  ];

  const petals = Array.from({ length: 16 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 3 + Math.random() * 4.5,
    speedY: 0.25 + Math.random() * 0.45,
    speedX: -0.25 + Math.random() * 0.5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.015,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.012) * 0.25;
      p.angle += p.spin;

      if (p.y > height + 16) {
        p.y = -16;
        p.x = Math.random() * width;
      }
      if (p.x > width + 16) p.x = -16;
      if (p.x < -16) p.x = width + 16;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   7. Ambient Wedding Music (music.mp3 with Smooth Gradual Volume Rise)
   -------------------------------------------------------------------------- */
function initAmbientMusic() {
  const toggleBtn = document.getElementById('sound-toggle');
  const iconOff = document.getElementById('icon-sound-off');
  const iconOn = document.getElementById('icon-sound-on');
  let audio = document.getElementById('wedding-music');

  if (!audio) {
    audio = new Audio('assets/music.mp3');
    audio.id = 'wedding-music';
    audio.preload = 'auto';
    audio.loop = true;
    document.body.appendChild(audio);
  } else {
    audio.loop = true;
  }

  let isPlaying = false;
  let fadeInterval = null;
  const TARGET_VOLUME = 0.75;
  const FADE_IN_DURATION_MS = 4000; // 4 seconds gradual volume rise
  const FADE_STEP_MS = 50;
  const VOLUME_INCREMENT = TARGET_VOLUME / (FADE_IN_DURATION_MS / FADE_STEP_MS);

  const updateIcon = (active) => {
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', String(active));
    }
    if (iconOff) iconOff.classList.toggle('hidden', active);
    if (iconOn) iconOn.classList.toggle('hidden', !active);
  };

  const fadeIn = () => {
    if (fadeInterval) clearInterval(fadeInterval);
    audio.volume = 0;
    fadeInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(fadeInterval);
        return;
      }
      if (audio.volume + VOLUME_INCREMENT >= TARGET_VOLUME) {
        audio.volume = TARGET_VOLUME;
        clearInterval(fadeInterval);
        fadeInterval = null;
      } else {
        audio.volume = Math.min(TARGET_VOLUME, audio.volume + VOLUME_INCREMENT);
      }
    }, FADE_STEP_MS);
  };

  const fadeOut = (callback) => {
    if (fadeInterval) clearInterval(fadeInterval);
    const FADE_OUT_DURATION_MS = 600;
    const VOLUME_DECREMENT = audio.volume / (FADE_OUT_DURATION_MS / FADE_STEP_MS);
    fadeInterval = setInterval(() => {
      if (audio.volume - VOLUME_DECREMENT <= 0.01) {
        audio.volume = 0;
        clearInterval(fadeInterval);
        fadeInterval = null;
        audio.pause();
        if (callback) callback();
      } else {
        audio.volume = Math.max(0, audio.volume - VOLUME_DECREMENT);
      }
    }, FADE_STEP_MS);
  };

  const start = () => {
    if (isPlaying) return;
    isPlaying = true;
    updateIcon(true);

    audio.play().then(() => {
      fadeIn();
    }).catch((err) => {
      console.warn('Audio playback waiting for user gesture:', err);
      isPlaying = false;
      updateIcon(false);
    });
  };

  const stop = () => {
    if (!isPlaying) return;
    isPlaying = false;
    updateIcon(false);
    fadeOut();
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        stop();
      } else {
        start();
      }
    });
  }

  musicController = {
    start,
    stop,
    isPlaying: () => isPlaying
  };
}

/* --------------------------------------------------------------------------
   8. Interactive Timeline Pearl Slider (Scroll Animated)
   -------------------------------------------------------------------------- */
function initTimelinePearl() {
  const wrapper = document.querySelector('.timeline-wrapper');
  const pearl = document.getElementById('timelineMovingPearl');
  if (!wrapper || !pearl) return;

  let startY = 14;
  let endY = 350;
  let ticking = false;

  function measureStops() {
    const wrapH = wrapper.offsetHeight || wrapper.clientHeight || 360;
    startY = 14;
    // Travel all the way down to the very bottom of the dotted line
    endY = Math.max(startY + 200, wrapH - 14);
  }

  function update() {
    ticking = false;
    measureStops();

    const rect = wrapper.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;

    // Slide starts as top of timeline enters the screen (~75% vh)
    // Finishes all the way at the bottom of the line as user scrolls through the section
    const startScroll = vh * 0.75;
    const endScroll = vh * 0.40 - (rect.height * 0.75);

    const scrollSpan = startScroll - endScroll;
    let progress = 0;
    if (scrollSpan > 0) {
      progress = (startScroll - rect.top) / scrollSpan;
      progress = Math.max(0, Math.min(1, progress));
    }

    const currentY = startY + progress * (endY - startY);
    pearl.style.top = `${currentY.toFixed(1)}px`;
  }

  function requestTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('touchmove', requestTick, { passive: true });
  window.addEventListener('wheel', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    measureStops();
    requestTick();
  });

  // Re-measure after initial layout and resource loads
  measureStops();
  update();
  window.addEventListener('load', () => {
    measureStops();
    update();
  });
  setTimeout(() => {
    measureStops();
    update();
  }, 300);
  setTimeout(() => {
    measureStops();
    update();
  }, 1000);
}



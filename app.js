document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  /*****************************************
   * 1. TAB SYSTEM NAVIGATION & HAMBURGER
   *****************************************/
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const sidebar = document.getElementById('sidebar-nav');
  const hamburger = document.getElementById('hamburger-toggle');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      
      // Update Navigation active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Update Tab Content display
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${targetTab}-tab`) {
          pane.classList.add('active');
        }
      });

      // Close mobile menu if open
      if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }

      // Re-trigger layout-sensitive calculations or animations
      if (targetTab === 'readiness') {
        updateQuizCircle();
      } else if (targetTab === 'governance') {
        updateTrustScore();
      } else if (targetTab === 'impact') {
        updateImpactDashboard();
      }
    });
  });

  // Hamburger Toggle for Mobile
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
  }

  // Click outside sidebar on mobile closes it
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== hamburger) {
      sidebar.classList.remove('mobile-open');
    }
  });


  /*****************************************
   * 2. THEME SWITCHER
   *****************************************/
  const themeToggle = document.getElementById('theme-toggle');
  const themeText = document.getElementById('theme-text');
  const htmlEl = document.documentElement;

  // Read saved preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'inline-block';
      themeText.textContent = 'Light Mode';
    } else {
      sunIcon.style.display = 'inline-block';
      moonIcon.style.display = 'none';
      themeText.textContent = 'Dark Mode';
    }
  }


  /*****************************************
   * 3. AI READINESS QUIZ ASSESSMENT ENGINE
   *****************************************/
  let currentStep = 1;
  const totalSteps = 5;
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const progressSteps = document.querySelectorAll('.quiz-progress-step');
  const questionViews = document.querySelectorAll('.question-view');
  
  // Elements for dynamic result displaying
  const resultCircle = document.getElementById('result-stroke-circle');
  const scoreDisplay = document.getElementById('display-score');
  const resultStageTitle = document.getElementById('result-stage-title');
  const resultStageDesc = document.getElementById('result-stage-desc');
  const resultDetailsPanel = document.getElementById('result-details-panel');
  const resultUseCases = document.getElementById('result-usecases');
  const resultPathTitle = document.getElementById('result-path-title');
  const resultPathDesc = document.getElementById('result-path-desc');

  // Quiz progression navigation handler
  nextBtn.addEventListener('click', () => {
    // Check if user answered the current step's question
    const activeRadio = document.querySelector(`input[name="q${currentStep}"]:checked`);
    if (!activeRadio) {
      alert("Please select an option to proceed.");
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      updateQuizUI();
    } else {
      // Calculate assessment result
      calculateReadinessResults();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateQuizUI();
    }
  });

  // Radio option labels clickable highlighting
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Auto transition to next question after selecting (optional, but let's just make it feel interactive)
      // We will allow users to review before clicking next
    });
  });

  function updateQuizUI() {
    // Update progress indicator steps
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        step.classList.add('active');
      } else if (stepNum < currentStep) {
        step.classList.add('completed');
      }
    });

    // Update active question view
    questionViews.forEach(view => {
      view.classList.remove('active');
      if (parseInt(view.getAttribute('data-step')) === currentStep) {
        view.classList.add('active');
      }
    });

    // Handle button labels and disabled states
    prevBtn.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
      nextBtn.textContent = 'Submit Assessment';
      nextBtn.classList.add('btn-accent');
    } else {
      nextBtn.textContent = 'Next';
      nextBtn.classList.remove('btn-accent');
    }
  }

  function calculateReadinessResults() {
    let totalScore = 0;
    for (let i = 1; i <= totalSteps; i++) {
      const checkedVal = document.querySelector(`input[name="q${i}"]:checked`);
      if (checkedVal) {
        totalScore += parseInt(checkedVal.value);
      }
    }

    const percentage = Math.round(totalScore / totalSteps);
    animateQuizScore(percentage);
    displayQuizCategories(percentage);
  }

  function animateQuizScore(score) {
    scoreDisplay.textContent = `${score}%`;
    const circumference = 2 * Math.PI * 70; // 439.82 -> approx 440
    const offset = circumference - (circumference * score / 100);
    resultCircle.style.strokeDasharray = `${circumference}`;
    resultCircle.style.strokeDashoffset = `${offset}`;
  }

  function updateQuizCircle() {
    // Recalculates radial stroke in case view was loaded before dashboard rendered
    const displayVal = scoreDisplay.textContent;
    if (displayVal !== '--') {
      const score = parseInt(displayVal);
      const circumference = 2 * Math.PI * 70;
      const offset = circumference - (circumference * score / 100);
      resultCircle.style.strokeDasharray = `${circumference}`;
      resultCircle.style.strokeDashoffset = `${offset}`;
    }
  }

  function displayQuizCategories(score) {
    let stageTitle = '';
    let stageDesc = '';
    let rolloutTitle = '';
    let rolloutDesc = '';
    let useCases = [];

    if (score >= 80) {
      stageTitle = "Level 4 – Innovator";
      stageDesc = "Leadership is locked in, data warehouses are mature, and team is ready. Focus is on advanced neural intelligence and storefront automation.";
      rolloutTitle = "Agile Enterprise Integration Pathway";
      rolloutDesc = "Deploy personalization and inventory optimization platforms concurrently, using sandbox containers with rapid iteration sprints.";
      useCases = ["Real-time Inventory Rebalancing", "Generative Marketing Ad Campaigns", "Executive Decision Copilots"];
    } else if (score >= 60) {
      stageTitle = "Level 3 – Practitioner";
      stageDesc = "Clear departmental ownership, decent analytical databases. Focus on expanding pilots to mid-level management workflows.";
      rolloutTitle = "Focused Departmental Scaling Pathway";
      rolloutDesc = "Expand customer support and operations tools into core teams, tracking KPIs closely before standardizing company-wide.";
      useCases = ["Customer Service Agent Drafts", "Predictive Store Scheduling", "Automated Compliance Auditing"];
    } else if (score >= 40) {
      stageTitle = "Level 2 – Explorer";
      stageDesc = "Strong leadership alignment but notable literacy and governance gaps. Focus on low-risk front-office pilots and training pathways.";
      rolloutTitle = "Front-facing HR Pilot Integration Pathway";
      rolloutDesc = "Deploy HR Policy Assistant and Customer Service draft engines to build training templates, and secure baseline usage guardrails.";
      useCases = ["HR Policy Virtual Assistant", "Customer Support Copilot", "Structured Product Meta Tags"];
    } else {
      stageTitle = "Level 1 – Novice";
      stageDesc = "Minimal structured planning. Siloed systems, literacy gaps, and lacks corporate governance guidelines. Focus on initial training and baseline setups.";
      rolloutTitle = "Strategic Foundation & Governance Pathway";
      rolloutDesc = "Establish AI policy committees, purchase corporate licenses of secure model sandboxes, and run employee literacy workshops.";
      useCases = ["Employee AI Literacy Portal", "AI Security Sandbox & Policy", "Pilot Feasibility Workshops"];
    }

    resultStageTitle.textContent = stageTitle;
    resultStageDesc.textContent = stageDesc;
    resultPathTitle.textContent = rolloutTitle;
    resultPathDesc.textContent = rolloutDesc;

    // Populate Use Cases
    resultUseCases.innerHTML = '';
    useCases.forEach(uc => {
      const tag = document.createElement('span');
      tag.className = 'usecase-tag';
      tag.innerHTML = `<i data-lucide="check-circle2"></i> ${uc}`;
      resultUseCases.appendChild(tag);
    });

    // Make panel visible
    resultDetailsPanel.style.display = 'block';
    
    // Refresh newly added icons
    lucide.createIcons();
  }


  /*****************************************
   * 4. DEPARTMENT ROADMAP FILTER & DATA
   *****************************************/
  const deptData = {
    hr: {
      name: "Human Resources",
      priority: "Medium",
      priorityClass: "badge-med",
      problem: "Slow policy responses and administrative overload on specialist workflows.",
      usecase: "Internal HR virtual assistant resolving basic policy inquiries using corporate manuals.",
      benefit: "Accelerated employee response support and automated initial resume screening formats.",
      kpi: "HR Query Resolution Time",
      uplift: "-65% Duration"
    },
    marketing: {
      name: "Marketing & Creative",
      priority: "Medium",
      priorityClass: "badge-med",
      problem: "High external costs for local assets and slow deployment cycles for personalized campaigns.",
      usecase: "Generative copy templates and product asset generation using branding-aligned models.",
      benefit: "Instant campaign copy variations and quick background scene generations for e-commerce assets.",
      kpi: "Content Asset Creation Speed",
      uplift: "10x Output"
    },
    finance: {
      name: "Finance & Accounting",
      priority: "Low",
      priorityClass: "badge-low",
      problem: "Manual validation loops for vendor invoices and periodic inventory audit mismatches.",
      usecase: "Automated document OCR extraction and transactional anomaly detection algorithms.",
      benefit: "Fewer processing errors, expedited compliance audits, and real-time fraud alert triggers.",
      kpi: "Invoice Audit Processing Speed",
      uplift: "-80% Time"
    },
    operations: {
      name: "Store Operations & Logistics",
      priority: "High",
      priorityClass: "badge-high",
      problem: "Inaccurate storefront inventory demand forecasts causing warehouse stockouts.",
      usecase: "Predictive logistics forecasting and scheduling integrated into inventory systems.",
      benefit: "Optimized inventory holding volumes and automated replenishment recommendations.",
      kpi: "Out-of-Stock Store Incidents",
      uplift: "-22% Stockouts"
    },
    cs: {
      name: "Customer Service",
      priority: "High",
      priorityClass: "badge-high",
      problem: "Heavy daily inquiry counts creating response backlogs of over 12 hours.",
      usecase: "Support agent drafts and automated response templates for order-tracking questions.",
      benefit: "Instant ticket categorization and rapid response drafts for review by human agents.",
      kpi: "Average Inquiry Resolution Time",
      uplift: "12h → 2h"
    }
  };

  const deptTabBtns = document.querySelectorAll('.dept-tab-btn');
  const deptSummaryCards = document.querySelectorAll('.dept-summary-card');

  // Handle Main Nav buttons
  deptTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedDept = btn.getAttribute('data-dept');
      updateDeptView(selectedDept);
      
      // Update active nav button
      deptTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Sync sidebar card
      deptSummaryCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-dept-select') === selectedDept) {
          card.classList.add('active');
        }
      });
    });
  });

  // Handle Sidebar Summary Cards
  deptSummaryCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedDept = card.getAttribute('data-dept-select');
      updateDeptView(selectedDept);

      // Update active card style
      deptSummaryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Sync nav button
      deptTabBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-dept') === selectedDept) {
          btn.classList.add('active');
        }
      });
    });
  });

  function updateDeptView(deptKey) {
    const data = deptData[deptKey];
    if (!data) return;

    const nameEl = document.getElementById('dept-display-name');
    const priorityEl = document.getElementById('dept-display-priority');
    const problemEl = document.getElementById('dept-display-problem');
    const usecaseEl = document.getElementById('dept-display-usecase');
    const benefitEl = document.getElementById('dept-display-benefit');
    const kpiEl = document.getElementById('dept-display-kpi');
    const upliftEl = document.getElementById('dept-display-uplift');
    const iconEl = document.getElementById('dept-display-icon');

    // Trigger smooth fade-in animation by re-adding the class
    const panel = document.getElementById('dept-detail-display');
    panel.style.animation = 'none';
    panel.offsetHeight; /* trigger reflow */
    panel.style.animation = null;

    // Update texts
    nameEl.textContent = data.name;
    priorityEl.textContent = `Priority: ${data.priority}`;
    problemEl.textContent = data.problem;
    usecaseEl.textContent = data.usecase;
    benefitEl.textContent = data.benefit;
    kpiEl.textContent = data.kpi;
    upliftEl.textContent = data.uplift;

    // Update priority class
    priorityEl.className = `badge ${data.priorityClass}`;

    // Update icon wrapper class & icon itself
    let iconName = 'users';
    if (deptKey === 'marketing') iconName = 'palette';
    if (deptKey === 'finance') iconName = 'wallet';
    if (deptKey === 'operations') iconName = 'truck';
    if (deptKey === 'cs') iconName = 'message-circle';
    
    iconEl.innerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();
  }


  /*****************************************
   * 5. TRAINING HUB & COMMUNICATION CALENDAR
   *****************************************/
  const calendarMonths = [
    {
      name: "June 2026",
      events: [
        { date: "June 2", title: "Launch Town Hall: Program Objectives", type: "town-hall" },
        { date: "June 9", title: "Bi-Weekly Newsletter: Baseline Diagnostics", type: "newsletter" },
        { date: "June 16", title: "Steering Committee: HR Policy Assistant", type: "meeting" },
        { date: "June 23", title: "Executive Prompting & Governance Workshop", type: "meeting" },
        { date: "June 30", title: "Newsletter: CS Draft Pilot Phase Results", type: "newsletter" }
      ]
    },
    {
      name: "July 2026",
      events: [
        { date: "July 7", title: "Mid-Management Scoping Consultation", type: "meeting" },
        { date: "July 14", title: "Monthly Progress Update Newsletter", type: "newsletter" },
        { date: "July 16", title: "Operations Replenishment Tool Review", type: "meeting" },
        { date: "July 21", title: "Company Town Hall: Pilot Success Metrics", type: "town-hall" },
        { date: "July 28", title: "Staff Onboarding & Feedback Seminar", type: "meeting" }
      ]
    }
  ];

  let currentCalIndex = 0;
  const calHeader = document.getElementById('calendar-month-year');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const calContainer = document.getElementById('calendar-events-container');

  function renderCalendar() {
    const month = calendarMonths[currentCalIndex];
    if (!month) return;

    calHeader.textContent = month.name;
    calContainer.innerHTML = '';

    month.events.forEach(ev => {
      const card = document.createElement('div');
      card.className = `calendar-event ${ev.type}`;
      card.innerHTML = `
        <span class="event-date">${ev.date}</span>
        <span class="event-title">${ev.title}</span>
        <span class="event-type-tag">${ev.type.replace('-', ' ')}</span>
      `;
      calContainer.appendChild(card);
    });

    calPrevBtn.disabled = currentCalIndex === 0;
    calNextBtn.disabled = currentCalIndex === calendarMonths.length - 1;
  }

  if (calPrevBtn && calNextBtn) {
    calPrevBtn.addEventListener('click', () => {
      if (currentCalIndex > 0) {
        currentCalIndex--;
        renderCalendar();
      }
    });

    calNextBtn.addEventListener('click', () => {
      if (currentCalIndex < calendarMonths.length - 1) {
        currentCalIndex++;
        renderCalendar();
      }
    });

    renderCalendar();
  }


  /*****************************************
   * 6. GOVERNANCE CHECKLIST & TRUST SCALE
   *****************************************/
  const checklistItems = document.querySelectorAll('.checklist-item');
  const trustGauge = document.getElementById('trust-gauge');
  const trustScorePct = document.getElementById('trust-score-pct');

  checklistItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateTrustScore();
    });
  });

  function updateTrustScore() {
    const checkedCount = document.querySelectorAll('.checklist-item.checked').length;
    const totalCount = checklistItems.length;
    if (totalCount === 0) return;

    const percentage = Math.round((checkedCount / totalCount) * 100);
    trustScorePct.textContent = `${percentage}%`;

    // Rotate gauge - baseline gauge is 120px circular half-donut rotated by -45deg.
    // Let's control the rotation or clipping. Simple way is rotation transform.
    // 0% -> -45deg, 100% -> 135deg (total 180 degrees sweep)
    const deg = -45 + (percentage * 1.8);
    if (trustGauge) {
      trustGauge.style.transform = `rotate(${deg}deg)`;
    }
  }

  updateTrustScore();


  /*****************************************
   * 7. KPI & IMPACT INTERACTIVE SLIDER
   *****************************************/
  const adoptionSlider = document.getElementById('adoption-scale-slider');
  const adoptionVal = document.getElementById('adoption-val');

  if (adoptionSlider) {
    adoptionSlider.addEventListener('input', () => {
      updateImpactDashboard();
    });
  }

  function updateImpactDashboard() {
    const val = parseInt(adoptionSlider.value);
    adoptionVal.textContent = `${val}%`;

    // Compute dynamic figures based on adoption rate
    
    // 1. Customer Service Time (12h down to 1.5h depending on scale)
    // 10% adoption -> CS time = 10.5 hrs, 100% adoption -> CS time = 1.5 hrs
    const csTime = (12 - (val / 100) * 10.5).toFixed(1);
    const csTimeEl = document.getElementById('metric-cs-time');
    const csPctEl = document.getElementById('metric-cs-pct');
    const csFillEl = document.getElementById('metric-cs-fill');
    
    if (csTimeEl) csTimeEl.textContent = `${csTime} Hrs`;
    const csPct = Math.round(((12 - csTime) / 12) * 100);
    if (csPctEl) csPctEl.textContent = `${csPct}% Better`;
    if (csFillEl) csFillEl.style.width = `${csPct}%`;

    // 2. Forecast Accuracy (Starts 68% -> scales up to 88%)
    const fcVal = Math.round(68 + (val / 100) * 20);
    const fcValEl = document.getElementById('metric-forecast-val');
    const fcPctEl = document.getElementById('metric-forecast-pct');
    const fcFillEl = document.getElementById('metric-forecast-fill');

    if (fcValEl) fcValEl.textContent = `${fcVal}%`;
    if (fcPctEl) fcPctEl.textContent = `${fcVal}%`;
    if (fcFillEl) fcFillEl.style.width = `${fcVal}%`;

    // 3. Hours Saved per Month (scales from 0 up to 550)
    const hoursSaved = Math.round((val / 100) * 550);
    const hoursSavedEl = document.getElementById('metric-hours-saved');
    const hoursPctEl = document.getElementById('metric-hours-pct');
    const hoursFillEl = document.getElementById('metric-hours-fill');

    if (hoursSavedEl) hoursSavedEl.textContent = `${hoursSaved} Hrs`;
    const hoursPct = Math.round((hoursSaved / 550) * 100);
    if (hoursPctEl) hoursPctEl.textContent = `${hoursPct}% Of Goal`;
    if (hoursFillEl) hoursFillEl.style.width = `${hoursPct}%`;

    // 4. Yearly Savings (scales from 0 to $850K)
    const savings = Math.round((val / 100) * 850);
    const savingsEl = document.getElementById('metric-savings-val');
    const savingsPctEl = document.getElementById('metric-savings-pct');
    const savingsFillEl = document.getElementById('metric-savings-fill');

    if (savingsEl) savingsEl.textContent = `$${savings}K`;
    const savingsPct = Math.round((savings / 850) * 100);
    if (savingsPctEl) savingsPctEl.textContent = `${savingsPct}% of Limit`;
    if (savingsFillEl) savingsFillEl.style.width = `${savingsPct}%`;

    // 5. Training completion (matches adoption closely)
    const trainingVal = Math.round(val);
    const trainingValEl = document.getElementById('metric-training-val');
    const trainingPctEl = document.getElementById('metric-training-pct');
    const trainingFillEl = document.getElementById('metric-training-fill');

    if (trainingValEl) trainingValEl.textContent = `${trainingVal}%`;
    if (trainingPctEl) trainingPctEl.textContent = `${trainingVal}%`;
    if (trainingFillEl) trainingFillEl.style.width = `${trainingVal}%`;

    // 6. Customer Retention (scales from 78% to 88%)
    const retentionVal = Math.round(78 + (val / 100) * 10);
    const retentionValEl = document.getElementById('metric-retention-val');
    const retentionPctEl = document.getElementById('metric-retention-pct');
    const retentionFillEl = document.getElementById('metric-retention-fill');

    if (retentionValEl) retentionValEl.textContent = `${retentionVal}%`;
    if (retentionPctEl) retentionPctEl.textContent = `${retentionVal}%`;
    if (retentionFillEl) retentionFillEl.style.width = `${retentionVal}%`;
  }

  // Handle KPI Category filtering buttons
  const kpiTabBtns = document.querySelectorAll('.kpi-tab-btn');
  const kpiCards = document.querySelectorAll('.kpi-card');

  kpiTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCat = btn.getAttribute('data-kpi-cat');
      
      kpiTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      kpiCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /*****************************************
   * 8. SCALING TIMELINE INTERACTION
   *****************************************/
  const timelinePhases = document.querySelectorAll('.timeline-phase');

  timelinePhases.forEach(phase => {
    phase.addEventListener('click', () => {
      // Toggle active states on timeline
      timelinePhases.forEach(p => p.classList.remove('active'));
      phase.classList.add('active');
    });
  });

});

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
      
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `${targetTab}-tab`) {
          pane.classList.add('active');
        }
      });

      if (sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
      }

      if (targetTab === 'readiness') {
        updateQuizCircle();
      } else if (targetTab === 'governance') {
        updateTrustScore();
      } else if (targetTab === 'impact') {
        updateImpactDashboard();
      }
    });
  });

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
  }

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
  
  const resultCircle = document.getElementById('result-stroke-circle');
  const scoreDisplay = document.getElementById('display-score');
  const resultStageTitle = document.getElementById('result-stage-title');
  const resultStageDesc = document.getElementById('result-stage-desc');
  const resultDetailsPanel = document.getElementById('result-details-panel');
  const resultUseCases = document.getElementById('result-usecases');
  const resultPathTitle = document.getElementById('result-path-title');
  const resultPathDesc = document.getElementById('result-path-desc');

  nextBtn.addEventListener('click', () => {
    const activeRadio = document.querySelector(`input[name="q${currentStep}"]:checked`);
    if (!activeRadio) {
      alert("Please select an option to proceed.");
      return;
    }

    if (currentStep < totalSteps) {
      currentStep++;
      updateQuizUI();
    } else {
      calculateReadinessResults();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateQuizUI();
    }
  });

  function updateQuizUI() {
    progressSteps.forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        step.classList.add('active');
      } else if (stepNum < currentStep) {
        step.classList.add('completed');
      }
    });

    questionViews.forEach(view => {
      view.classList.remove('active');
      if (parseInt(view.getAttribute('data-step')) === currentStep) {
        view.classList.add('active');
      }
    });

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
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (circumference * score / 100);
    resultCircle.style.strokeDasharray = `${circumference}`;
    resultCircle.style.strokeDashoffset = `${offset}`;
  }

  function updateQuizCircle() {
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

    resultUseCases.innerHTML = '';
    useCases.forEach(uc => {
      const tag = document.createElement('span');
      tag.className = 'usecase-tag';
      tag.innerHTML = `<i data-lucide="check-circle2"></i> ${uc}`;
      resultUseCases.appendChild(tag);
    });

    resultDetailsPanel.style.display = 'block';
    lucide.createIcons();
  }


  /*****************************************
   * 4. DEPARTMENT ROADMAP FILTER & DATA
   *****************************************/
  const deptData = {
    hr: {
      name: "Human Resources",
      type: "Internal Implementation",
      priority: "Medium",
      priorityClass: "badge-med",
      typeClass: "badge-internal",
      problem: "Slow internal policy responses, heavy administrative burden, and onboarding delays.",
      usecase: "AI Policy Navigator, Recruitment Assistant, Onboarding Coach, and L&D Curator.",
      benefit: "Instantly answers policy queries via voice/chat, screens CVs bias-free, and customizes onboarding journeys.",
      kpi: "HR Query Resolution Speed & Onboarding Task Completion Rate",
      uplift: "-40% Time Saved"
    },
    marketing: {
      name: "Marketing & Creative",
      type: "Internal Implementation",
      priority: "Medium",
      priorityClass: "badge-med",
      typeClass: "badge-internal",
      problem: "High external asset agency costs, slow localized campaigns, and lack of content scaling.",
      usecase: "AI Content Studio, Trend Radar Dashboard, Campaign Optimizer, and Creative Collaboration Hub.",
      benefit: "Generates multi-tone copies, monitors trending hashtags, and simulates A/B performance outcomes before budget spend.",
      kpi: "Asset Cycle Time & Ad Campaign Conversion Growth",
      uplift: "10x Output Velocity"
    },
    finance: {
      name: "Finance & Accounting",
      type: "Internal Implementation",
      priority: "Low",
      priorityClass: "badge-low",
      typeClass: "badge-internal",
      problem: "Labor-intensive vendor invoice validation, audit cycle bottlenecks, and cash flow planning volatility.",
      usecase: "Smart Report Validator, Cash Flow Forecaster, Budget Alignment Assistant, and Scenario Simulation Engine.",
      benefit: "Scans financial reports for anomalies, predicts liquidity risks, and models what-if revenue fluctuations.",
      kpi: "Report Audit Speed & Unresolved Overspend Incidents",
      uplift: "-35% Cycle Time"
    },
    research: {
      name: "Research & Development",
      type: "Internal Implementation",
      priority: "Low",
      priorityClass: "badge-low",
      typeClass: "badge-internal",
      problem: "Inconsistent prompt structures, slow sustainability modeling, and risk of untested storefront concepts.",
      usecase: "Prompt Engineering Knowledge Hub, Retail Innovation Sandbox, and Material Optimization models.",
      benefit: "Stores optimized prompt templates, conducts sustainability trade-off checks, and tests digital mirrors in a sandbox environment.",
      kpi: "Pilot-to-Scale Time & Recommendation Acceptance Rate",
      uplift: "-25% concept validation"
    },
    operations: {
      name: "Store Operations & Logistics",
      type: "External Implementation",
      priority: "High",
      priorityClass: "badge-high",
      typeClass: "badge-external",
      problem: "Inaccurate storefront stock predictions causing warehouse backlogs or empty retail shelves.",
      usecase: "Customer Flow Management, Smart Inventory & Product Placement, and Smart Workforce Scheduler.",
      benefit: "Tracks section convert rates via in-store sensors, suggests dynamic product shelving, and matches staff shifts to traffic peaks.",
      kpi: "Out-of-Stock Shelf Rates & Staff Overlapping Cost",
      uplift: "+20% Forecast Accuracy"
    },
    cs: {
      name: "Customer Service",
      type: "External Implementation",
      priority: "High",
      priorityClass: "badge-high",
      typeClass: "badge-external",
      problem: "High daily ticket inquiries generating response backlogs of over 12 hours.",
      usecase: "AI Customer Support Agent, Sentiment-Based Routing, and Customer Memory Layer.",
      benefit: "Resolves shipment checks instantly, routes frustrated inquiries to managers, and retains cross-channel interaction histories.",
      kpi: "Average Resolution Time & Customer Morale Scoring",
      uplift: "12 Hrs → 2 Hrs"
    }
  };

  const deptTabBtns = document.querySelectorAll('.dept-tab-btn');
  const deptSummaryCards = document.querySelectorAll('.dept-summary-card');

  deptTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedDept = btn.getAttribute('data-dept');
      updateDeptView(selectedDept);
      
      deptTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      deptSummaryCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-dept-select') === selectedDept) {
          card.classList.add('active');
        }
      });
    });
  });

  deptSummaryCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedDept = card.getAttribute('data-dept-select');
      updateDeptView(selectedDept);

      deptSummaryCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

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
    const typeEl = document.getElementById('dept-display-type');
    const problemEl = document.getElementById('dept-display-problem');
    const usecaseEl = document.getElementById('dept-display-usecase');
    const benefitEl = document.getElementById('dept-display-benefit');
    const kpiEl = document.getElementById('dept-display-kpi');
    const upliftEl = document.getElementById('dept-display-uplift');
    const iconEl = document.getElementById('dept-display-icon');

    const panel = document.getElementById('dept-detail-display');
    panel.style.animation = 'none';
    panel.offsetHeight; 
    panel.style.animation = null;

    nameEl.textContent = data.name;
    priorityEl.textContent = `Priority: ${data.priority}`;
    typeEl.textContent = data.type;
    problemEl.textContent = data.problem;
    usecaseEl.textContent = data.usecase;
    benefitEl.textContent = data.benefit;
    kpiEl.textContent = data.kpi;
    upliftEl.textContent = data.uplift;

    priorityEl.className = `badge ${data.priorityClass}`;
    typeEl.className = `badge ${data.typeClass}`;

    let iconName = 'users';
    if (deptKey === 'marketing') iconName = 'palette';
    if (deptKey === 'finance') iconName = 'wallet';
    if (deptKey === 'research') iconName = 'lightbulb';
    if (deptKey === 'operations') iconName = 'truck';
    if (deptKey === 'cs') iconName = 'message-circle';
    
    iconEl.innerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons();
  }


  /*****************************************
   * 5. ROLE LEARNING PATHS (PILLAR 1)
   *****************************************/
  const learningBtns = document.querySelectorAll('.learning-tab-btn');
  const learningDetails = document.querySelectorAll('.learning-path-detail');

  learningBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRole = btn.getAttribute('data-role');
      
      learningBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      learningDetails.forEach(detail => {
        detail.classList.remove('active');
        if (detail.getAttribute('data-role-detail') === selectedRole) {
          detail.classList.add('active');
        }
      });
    });
  });


  /*****************************************
   * 6. TRAINING HUB & COMMUNICATION CALENDAR
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
   * 7. GOVERNANCE CHECKLIST & TRUST SCALE
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

    const deg = -45 + (percentage * 1.8);
    if (trustGauge) {
      trustGauge.style.transform = `rotate(${deg}deg)`;
    }
  }

  updateTrustScore();


  /*****************************************
   * 8. AI READINESS PASSPORT PROGRAM LOGIC
   *****************************************/
  const passportDeptSelect = document.getElementById('passport-dept');
  const passportStageSelect = document.getElementById('passport-stage');
  const passportDisplayTitle = document.getElementById('passport-display-title');
  const passportDisplayCriteria = document.getElementById('passport-display-criteria');

  const passportData = {
    hr: {
      explorer: "Complete AI Policy Navigator onboarding & complete 5 automated policy searches.",
      practitioner: "Successfully run 10 CV screenings using the Recruitment Assistant and provide safety evaluations.",
      champion: "Lead the team training workshop, validate 2 onboarding paths, and act as primary feedback focal.",
      leader: "Design a new skill mapping recommendation module for the L&D Curator and present it to the steering committee."
    },
    marketing: {
      explorer: "Access the Trend Radar Dashboard and identify 3 key trending topics relevant to your brand.",
      practitioner: "Generate 5 brand-aligned campaign copies across channels using the AI Content Studio.",
      champion: "Execute 2 pre-launch simulations in the Campaign Optimizer and present the ROI forecasts to leads.",
      leader: "Conceive and moderate a collaborative idea voting sprint in the Creative Collaboration Hub."
    },
    finance: {
      explorer: "Load and scan 3 invoices inside the Smart Report Validator to verify confidence flags.",
      practitioner: "Set up reallocation parameters in the Budget Alignment Assistant and resolve 2 overspend warnings.",
      champion: "Design cash flow risk mitigation prompts in the Predictive Forecaster for executive reviews.",
      leader: "Run complex what-if scenarios inside the Scenario Simulation Engine to model raw margin risks."
    },
    operations: {
      explorer: "Onboard on store traffic cameras and review dwell time heatmap records.",
      practitioner: "Analyze converting percentages across sections and adjust shelving in Smart Inventory.",
      champion: "Configure staffing profiles in the Smart Scheduler to match forecast traffic curves.",
      leader: "Deploy in-store prediction models to automate restocking suggestions and measure stockout reductions."
    },
    cs: {
      explorer: "Onboard on the Customer Support Agent interface and verify response draft controls.",
      practitioner: "Resolve 15 inquiry tickets using model drafts and rate recommendation accuracy.",
      champion: "Handle 5 high-frustration escalations redirected by sentiment routing loops.",
      leader: "Analyze monthly Voice of the Customer sentiment reports to design churn intervention reward campaigns."
    }
  };

  function updatePassportCriteria() {
    const dept = passportDeptSelect.value;
    const stage = passportStageSelect.value;
    const criteria = passportData[dept][stage];

    const stageLabel = passportStageSelect.options[passportStageSelect.selectedIndex].text;
    const deptLabel = passportDeptSelect.options[passportDeptSelect.selectedIndex].text;

    passportDisplayTitle.innerHTML = `<i data-lucide="shield-check"></i> ${deptLabel} – ${stageLabel} Criteria`;
    passportDisplayCriteria.textContent = criteria;

    lucide.createIcons();
  }

  if (passportDeptSelect && passportStageSelect) {
    passportDeptSelect.addEventListener('change', updatePassportCriteria);
    passportStageSelect.addEventListener('change', updatePassportCriteria);
    updatePassportCriteria(); 
  }


  /*****************************************
   * 9. KPI & IMPACT INTERACTIVE SLIDER
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

    const csTime = (12 - (val / 100) * 10.5).toFixed(1);
    const csTimeEl = document.getElementById('metric-cs-time');
    const csPctEl = document.getElementById('metric-cs-pct');
    const csFillEl = document.getElementById('metric-cs-fill');
    
    if (csTimeEl) csTimeEl.textContent = `${csTime} Hrs`;
    const csPct = Math.round(((12 - csTime) / 12) * 100);
    if (csPctEl) csPctEl.textContent = `${csPct}% Better`;
    if (csFillEl) csFillEl.style.width = `${csPct}%`;

    const fcVal = Math.round(68 + (val / 100) * 20);
    const fcValEl = document.getElementById('metric-forecast-val');
    const fcPctEl = document.getElementById('metric-forecast-pct');
    const fcFillEl = document.getElementById('metric-forecast-fill');

    if (fcValEl) fcValEl.textContent = `${fcVal}%`;
    if (fcPctEl) fcPctEl.textContent = `${fcVal}%`;
    if (fcFillEl) fcFillEl.style.width = `${fcVal}%`;

    const hoursSaved = Math.round((val / 100) * 550);
    const hoursSavedEl = document.getElementById('metric-hours-saved');
    const hoursPctEl = document.getElementById('metric-hours-pct');
    const hoursFillEl = document.getElementById('metric-hours-fill');

    if (hoursSavedEl) hoursSavedEl.textContent = `${hoursSaved} Hrs`;
    const hoursPct = Math.round((hoursSaved / 550) * 100);
    if (hoursPctEl) hoursPctEl.textContent = `${hoursPct}% Of Goal`;
    if (hoursFillEl) hoursFillEl.style.width = `${hoursPct}%`;

    const savings = Math.round((val / 100) * 850);
    const savingsEl = document.getElementById('metric-savings-val');
    const savingsPctEl = document.getElementById('metric-savings-pct');
    const savingsFillEl = document.getElementById('metric-savings-fill');

    if (savingsEl) savingsEl.textContent = `$${savings}K`;
    const savingsPct = Math.round((savings / 850) * 100);
    if (savingsPctEl) savingsPctEl.textContent = `${savingsPct}% of Limit`;
    if (savingsFillEl) savingsFillEl.style.width = `${savingsPct}%`;

    const trainingVal = Math.round(val);
    const trainingValEl = document.getElementById('metric-training-val');
    const trainingPctEl = document.getElementById('metric-training-pct');
    const trainingFillEl = document.getElementById('metric-training-fill');

    if (trainingValEl) trainingValEl.textContent = `${trainingVal}%`;
    if (trainingPctEl) trainingPctEl.textContent = `${trainingVal}%`;
    if (trainingFillEl) trainingFillEl.style.width = `${trainingVal}%`;

    const retentionVal = Math.round(78 + (val / 100) * 10);
    const retentionValEl = document.getElementById('metric-retention-val');
    const retentionPctEl = document.getElementById('metric-retention-pct');
    const retentionFillEl = document.getElementById('metric-retention-fill');

    if (retentionValEl) retentionValEl.textContent = `${retentionVal}%`;
    if (retentionPctEl) retentionPctEl.textContent = `${retentionVal}%`;
    if (retentionFillEl) retentionFillEl.style.width = `${retentionVal}%`;

    updateKpiFrameworkTable(val);
  }

  function updateKpiFrameworkTable(sliderVal) {
    const adoptionTarget = Math.round(sliderVal);
    const efficiencyFactor = sliderVal / 100;

    updateCell('tb-hr-ad', `${adoptionTarget}%`);
    updateCell('tb-hr-ef', `-${Math.round(efficiencyFactor * 40)}% time`);
    updateCell('tb-hr-vl', `+${Math.round(efficiencyFactor * 20)}% rating`);

    updateCell('tb-mk-ad', `${adoptionTarget}%`);
    updateCell('tb-mk-ef', `-${Math.round(efficiencyFactor * 30)}% time`);
    updateCell('tb-mk-vl', `+${Math.round(efficiencyFactor * 20)}% perform`);

    updateCell('tb-fn-ad', `${Math.min(100, Math.round(adoptionTarget * 1.15))}%`);
    updateCell('tb-fn-ef', `-${Math.round(efficiencyFactor * 35)}% time`);
    updateCell('tb-fn-vl', `-${Math.round(efficiencyFactor * 50)}% risk count`);

    updateCell('tb-rd-ad', `${Math.min(100, Math.round(adoptionTarget * 1.15))}%`);
    updateCell('tb-rd-ef', `-${Math.round(efficiencyFactor * 25)}% time`);
    updateCell('tb-rd-vl1', `${Math.round(50 + efficiencyFactor * 20)}%+ target`);
    updateCell('tb-rd-vl2', `${Math.round(30 + efficiencyFactor * 20)}%+ recomm`);

    updateCell('tb-op-ad', `${Math.round(adoptionTarget * 0.95)}%`);
    updateCell('tb-op-ef', `+${Math.round(efficiencyFactor * 20)}% accuracy`);
    updateCell('tb-op-vl1', `-${Math.round(efficiencyFactor * 25)}% costs`);
    updateCell('tb-op-vl2', `+${Math.round(efficiencyFactor * 10)}% convert`);

    updateCell('tb-cs-ad', `${adoptionTarget}%`);
    updateCell('tb-cs-ef', `-${Math.round(efficiencyFactor * 45)}% time`);
    updateCell('tb-cs-vl1', `+${Math.round(efficiencyFactor * 10)}% loyalty`);
    updateCell('tb-cs-vl2', `${Math.round(30 + efficiencyFactor * 70)}% delivery`);
  }

  function updateCell(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

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
   * 10. NON-LINEAR SCALING TIMELINE WIDGET
   *****************************************/
  const timelinePhases = document.querySelectorAll('.timeline-phase');
  const loopBtns = document.querySelectorAll('.loopback-btn');

  timelinePhases.forEach(phase => {
    phase.addEventListener('click', () => {
      timelinePhases.forEach(p => p.classList.remove('active'));
      phase.classList.add('active');
    });
  });

  // Handle Loopback buttons interaction
  loopBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering timeline phase selection
      const phaseNum = btn.getAttribute('data-loop-btn');
      const alertBox = document.getElementById(`loop-alert-${phaseNum}`);

      if (alertBox) {
        // Toggle visibility of the loop info panel
        if (alertBox.style.display === 'block') {
          alertBox.style.display = 'none';
        } else {
          // Hide all loop alerts first to stay clean
          document.querySelectorAll('.loopback-alert-box').forEach(box => {
            box.style.display = 'none';
          });
          alertBox.style.display = 'block';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  });


  /*****************************************
   * 11. CASE STUDY INTERACTIVE SIMULATOR
   *****************************************/
  const caseNextBtn = document.getElementById('case-next-btn');
  const casePrevBtn = document.getElementById('case-prev-btn');
  const caseChapterTitle = document.getElementById('case-chapter-title');
  const caseChapterBody = document.getElementById('case-chapter-body');
  const caseDots = document.querySelectorAll('.case-study-dot');

  let currentChapter = 1;
  const chapters = [
    {
      title: "Chapter 1: The Starting Point (Ambition & Challenge)",
      body: "A large European fashion retailer operates both physical stores and e-commerce portals. Early disconnected pilots had failed to scale. Customer records remain siloed, demand forecasts are inconsistent, and staff show low confidence. They adopt the RetailAI Catalyst program.",
      phase: 1,
      alert: null
    },
    {
      title: "Chapter 2: Pillar 1 & The First Loop (Leadership Alignment)",
      body: "Senior leadership runs AI workshops, assigns sponsors, and defines priority areas. However, employee trust surveys reveal high change uncertainty. Recognizing this baseline weakness early, the retailer cycles back within Phase 1, strengthening communication and manager training before moving forward.",
      phase: 1,
      alert: 1
    },
    {
      title: "Chapter 3: Pillar 2 & Pilot Check (Education & Testing)",
      body: "With improved trust, the retailer enters Phase 2. Role-specific learning journeys and AI passports roll out alongside HR policy, marketing, and CS support pilots. Although CS has high usage, marketing adoption stalls. The framework triggers a loopback: scaling is paused while the team simplifies workflows and coaches marketing managers.",
      phase: 2,
      alert: 2
    },
    {
      title: "Chapter 4: Pillar 3 & The Trust Loop (Department Integration)",
      body: "Successful pilots scale to additional store locations, and departments link via the Snowflake/BigQuery intelligence hub. Inventory forecasting improves significantly. However, operations teams report difficulty trusting automated stock schedules. The framework cycles back to Phase 1 targeted training once again.",
      phase: 3,
      alert: 3
    },
    {
      title: "Chapter 5: Pillar 4 & Measurement (Outcome Review)",
      body: "Department leads review the 21 KPIs (Adoption, Efficiency, Value). Successful pilots move forward into standard operating templates, while underperforming ones (e.g. content variations failing to show ROI) are flagged and sent back for redesign, focusing only on solutions that generate actual business value.",
      phase: 4,
      alert: null
    },
    {
      title: "Chapter 6: Pillar 5 & Continuous Scaling (Plan-Do-Check-Act)",
      body: "Validated tools roll out nationally. Personalization and computer-vision store heatmaps go live. Scaling remains conditional: if adoption or value gains slip, the Plan-Do-Check-Act (PDCA) cycle automatically triggers a return to earlier pillars to strengthen training or alignment.",
      phase: 5,
      alert: 5
    }
  ];

  function renderChapter() {
    const chap = chapters[currentChapter - 1];
    if (!chap) return;

    // Update text content
    caseChapterTitle.textContent = chap.title;
    caseChapterBody.textContent = chap.body;

    // Update progress dots
    caseDots.forEach((dot, index) => {
      dot.classList.remove('active');
      if (index + 1 === currentChapter) {
        dot.classList.add('active');
      }
    });

    // Update timeline active state & trigger loop alerts
    timelinePhases.forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.loopback-alert-box').forEach(box => {
      box.style.display = 'none';
    });

    const activeTimelinePhase = document.querySelector(`.timeline-phase[data-phase="${chap.phase}"]`);
    if (activeTimelinePhase) {
      activeTimelinePhase.classList.add('active');
      // Scroll timeline area slightly to show it
      activeTimelinePhase.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (chap.alert !== null) {
      const activeAlertBox = document.getElementById(`loop-alert-${chap.alert}`);
      if (activeAlertBox) {
        activeAlertBox.style.display = 'block';
      }
    }

    // Enable/disable buttons
    casePrevBtn.disabled = currentChapter === 1;
    if (currentChapter === chapters.length) {
      caseNextBtn.textContent = "Restart Case Study";
    } else {
      caseNextBtn.textContent = "Next Chapter";
    }
  }

  if (caseNextBtn && casePrevBtn) {
    caseNextBtn.addEventListener('click', () => {
      if (currentChapter < chapters.length) {
        currentChapter++;
        renderChapter();
      } else {
        currentChapter = 1;
        renderChapter();
      }
    });

    casePrevBtn.addEventListener('click', () => {
      if (currentChapter > 1) {
        currentChapter--;
        renderChapter();
      }
    });

    renderChapter(); // Render initial chapter
  }

});

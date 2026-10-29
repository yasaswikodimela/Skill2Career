/* ==============================================
   HireSphere — script.js
   Role-based nav, Applied Jobs, AI Resume,
   Profile panel, Auth — no Dashboard
   ============================================== */

/* =============================================
   SECTION 1: JOB DATA
   Sample jobs used across all sections
============================================= */
const jobsData = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Stripe",
    logo: "ST",
    logoColor: "logo-blue",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k – $165k",
    salaryNum: 120,
    skills: ["React", "TypeScript", "GraphQL", "Tailwind"],
    description: "Build the interfaces used by millions of businesses worldwide. You'll work closely with design and product on our payments dashboard.",
    postedDays: 1,
    featured: true,
    applications: 84
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Airbnb",
    logo: "AB",
    logoColor: "logo-red",
    location: "Remote",
    type: "Full-time",
    salary: "$115k – $150k",
    salaryNum: 115,
    skills: ["Product Strategy", "SQL", "Figma", "A/B Testing"],
    description: "Define the product vision for the Homes team. Own the roadmap, work with engineering and design to ship features used by 200M guests.",
    postedDays: 2,
    featured: true,
    applications: 122
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Netflix",
    logo: "NF",
    logoColor: "logo-red",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$130k – $175k",
    salaryNum: 130,
    skills: ["Python", "Machine Learning", "SQL", "Spark"],
    description: "Build recommendation models that delight 230M subscribers. Work on personalisation, content ranking, and revenue optimisation.",
    postedDays: 3,
    featured: true,
    applications: 68
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Figma",
    logo: "FG",
    logoColor: "logo-purple",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k – $140k",
    salaryNum: 100,
    skills: ["Figma", "Prototyping", "User Research", "Motion Design"],
    description: "Design next-generation creative tools for the world's best design teams. Full design ownership from concept to production.",
    postedDays: 4,
    featured: true,
    applications: 97
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Vercel",
    logo: "VC",
    logoColor: "logo-teal",
    location: "Remote",
    type: "Remote",
    salary: "$110k – $150k",
    salaryNum: 110,
    skills: ["Kubernetes", "AWS", "CI/CD", "Terraform", "Docker"],
    description: "Maintain the infrastructure that powers deployments for 1M+ developers. Deep focus on reliability, performance, and developer experience.",
    postedDays: 2,
    featured: false,
    applications: 43
  },
  {
    id: 6,
    title: "Backend Engineer",
    company: "GitHub",
    logo: "GH",
    logoColor: "logo-green",
    location: "Remote",
    type: "Remote",
    salary: "$120k – $160k",
    salaryNum: 120,
    skills: ["Ruby", "Go", "PostgreSQL", "Redis"],
    description: "Build the platform that 100M developers use. Work on core API, Actions, and repositories at massive scale.",
    postedDays: 5,
    featured: false,
    applications: 76
  },
  {
    id: 7,
    title: "iOS Developer",
    company: "Spotify",
    logo: "SP",
    logoColor: "logo-green",
    location: "Stockholm, Sweden",
    type: "Full-time",
    salary: "$95k – $130k",
    salaryNum: 95,
    skills: ["Swift", "SwiftUI", "MVVM", "Core Audio"],
    description: "Shape the iOS experience for 600M music lovers. Own features from sketch to App Store release.",
    postedDays: 6,
    featured: false,
    applications: 55
  },
  {
    id: 8,
    title: "Growth Marketing Manager",
    company: "Notion",
    logo: "NO",
    logoColor: "logo-amber",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90k – $125k",
    salaryNum: 90,
    skills: ["SEO", "Paid Acquisition", "Analytics", "Content Strategy"],
    description: "Drive growth for Notion's 30M+ user base. Own paid channels, run experiments, and collaborate with product on activation.",
    postedDays: 1,
    featured: false,
    applications: 110
  },
  {
    id: 9,
    title: "Machine Learning Engineer",
    company: "OpenAI",
    logo: "OA",
    logoColor: "logo-teal",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$175k – $250k",
    salaryNum: 175,
    skills: ["PyTorch", "Python", "Distributed Training", "CUDA", "Machine Learning"],
    description: "Train and deploy frontier AI models. Work on scaling infrastructure, alignment research, and model capabilities.",
    postedDays: 3,
    featured: false,
    applications: 210
  },
  {
    id: 10,
    title: "Finance Analyst",
    company: "Brex",
    logo: "BX",
    logoColor: "logo-orange",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85k – $115k",
    salaryNum: 85,
    skills: ["Financial Modelling", "SQL", "Excel", "Tableau"],
    description: "Build financial models and dashboards to support strategic decisions at one of fintech's fastest-growing companies.",
    postedDays: 7,
    featured: false,
    applications: 38
  },
  {
    id: 11,
    title: "Content Strategist",
    company: "HubSpot",
    logo: "HS",
    logoColor: "logo-orange",
    location: "Remote",
    type: "Remote",
    salary: "$75k – $100k",
    salaryNum: 75,
    skills: ["Content Marketing", "SEO", "CMS", "Copywriting", "HTML"],
    description: "Own content strategy for HubSpot's blog reaching 7M+ monthly readers. Drive organic growth through editorial excellence.",
    postedDays: 4,
    featured: false,
    applications: 62
  },
  {
    id: 12,
    title: "Security Engineer",
    company: "Cloudflare",
    logo: "CF",
    logoColor: "logo-orange",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$130k – $170k",
    salaryNum: 130,
    skills: ["Penetration Testing", "Rust", "Network Security", "Zero Trust", "AWS"],
    description: "Protect one of the world's largest networks. Work on threat detection, incident response, and building security tooling at scale.",
    postedDays: 2,
    featured: false,
    applications: 47
  }
];

/* Application counter tracker */
const applicationCounts = {};
jobsData.forEach(j => { applicationCounts[j.id] = j.applications; });

const jobSeekers = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    experience: "2 years",
    email: "rahul@gmail.com"
  },
  {
    name: "Anita Patel",
    role: "Data Scientist",
    skills: ["Python", "Machine Learning", "SQL"],
    experience: "3 years",
    email: "anita@gmail.com"
  },
  {
    name: "Maya Reddy",
    role: "Full Stack Developer",
    skills: ["Node.js", "React", "PostgreSQL"],
    experience: "4 years",
    email: "maya@gmail.com"
  },
  {
    name: "Samir Khan",
    role: "UI/UX Designer",
    skills: ["Figma", "Sketch", "Prototyping"],
    experience: "3 years",
    email: "samir@gmail.com"
  }
];

/* =============================================
   SECTION 2: AUTH STATE
   Role stored in localStorage as hs_user
============================================= */
let loginRole = 'seeker';
let regRole   = 'seeker';
let currentApplyJobId = null;

/* =============================================
   SECTION 3: SECTION NAVIGATION
   Hides all sections, shows the target one.
   Role-aware: applied only for seekers, recruiter only for recruiters.
============================================= */
function showSection(name) {
  const allSections = ['home', 'jobs', 'recruiter', 'hire'];

  allSections.forEach(s => {
    const el = document.getElementById('section-' + s);
    if (el) el.style.display = 'none';
  });

  if (name === 'hire') {
    const user = getUser();
    if (!user || user.role !== 'recruiter') {
      name = 'home';
    }
  }

  const target = document.getElementById('section-' + name);
  if (target) {
    target.style.display = '';
    target.style.animation = 'none';
    requestAnimationFrame(() => { target.style.animation = 'fadeIn .35s ease'; });
  }

  document.querySelectorAll('.hs-nav-link').forEach(link => {
    const sec = link.getAttribute('data-section');
    link.classList.toggle('active', sec === name);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'jobs') renderJobsGrid(jobsData);
  if (name === 'home') renderFeaturedJobs();
  if (name === 'hire') renderJobSeekers(jobSeekers);

  const navCollapse = document.getElementById('navContent');
  if (navCollapse && navCollapse.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse) bsCollapse.hide();
  }

  return false;
}

function updateHomeResumeVisibility() {
  const user = getUser();
  const resumeBox = document.getElementById('resumeAiBox');
  if (!resumeBox) return;
  if (user && user.role === 'seeker') {
    resumeBox.style.display = '';
  } else {
    resumeBox.style.display = 'none';
  }
}


/* =============================================
   SECTION 4: ROLE-BASED NAVBAR
   Rebuilds nav links based on user role.
   Seekers: Home, Browse Jobs, Applied Jobs
   Recruiters: Home, Browse Jobs, Post a Job
============================================= */
function buildNavLinks(role) {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  const seekerLinks = `
    <li class="nav-item">
      <a class="nav-link hs-nav-link" href="#" data-section="home" onclick="showSection('home');return false;">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link hs-nav-link" href="#" data-section="jobs" onclick="showSection('jobs');return false;">Browse Jobs</a>
    </li>`;

  const recruiterLinks = `
    <li class="nav-item">
      <a class="nav-link hs-nav-link" href="#" data-section="home" onclick="showSection('home');return false;">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link hs-nav-link" href="#" data-section="hire" onclick="showSection('hire');return false;">Hire Employee</a>
    </li>
    <li class="nav-item">
      <a class="nav-link hs-nav-link" href="#" data-section="recruiter" onclick="showSection('recruiter');return false;">Post Job</a>
    </li>`;

  const guestLinks = seekerLinks;

  if (role === 'seeker') navLinks.innerHTML = seekerLinks;
  else if (role === 'recruiter') navLinks.innerHTML = recruiterLinks;
  else navLinks.innerHTML = guestLinks;
}

function renderJobSeekers(seekers) {
  const wrap = document.getElementById('hireResults');
  if (!wrap) return;

  if (!Array.isArray(seekers) || seekers.length === 0) {
    wrap.innerHTML = '<div class="alert alert-secondary">No candidates found. Try another role.</div>';
    return;
  }

  wrap.innerHTML = seekers.map(js => `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h5 class="card-title mb-1">${js.name}</h5>
            <div class="text-muted mb-2">${js.role} · ${js.experience}</div>
          </div>
          <a href="mailto:${js.email}" class="btn btn-sm btn-outline-primary">Email</a>
        </div>
        <div class="mb-2"><strong>Skills:</strong> ${js.skills.join(', ')}</div>
        <div><i class="bi bi-envelope me-1"></i>${js.email}</div>
      </div>
    </div>`).join('');
}

function searchJobSeekers() {
  const query = (document.getElementById('hireSearchInput')?.value || '').trim().toLowerCase();
  if (!query) {
    renderJobSeekers(jobSeekers);
    return;
  }

  const results = jobSeekers.filter(js => js.role.toLowerCase().includes(query));
  renderJobSeekers(results);
}


/* =============================================
   SECTION 5: PROFILE DROPDOWN (post-login navbar)
   Shows user email + dropdown with Profile / Logout
============================================= */
function showLoggedInUser() {
  const user = getUser();
  if (!user) return;

  const navAuth = document.getElementById('navAuthButtons');
  if (!navAuth) return;

  const displayEmail = user.email.length > 22
    ? user.email.slice(0, 20) + '…'
    : user.email;

  const roleIcon = user.role === 'recruiter'
    ? 'bi-building'
    : 'bi-person-circle';

  navAuth.innerHTML = `
    <div class="dropdown">
      <button
        class="btn hs-btn-primary dropdown-toggle d-flex align-items-center gap-2"
        type="button"
        id="profileDropdownBtn"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style="cursor:pointer">
        <i class="bi ${roleIcon}"></i>
        <span class="d-none d-md-inline" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${displayEmail}</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="profileDropdownBtn">
        <li><h6 class="dropdown-header" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:.5px;color:#94A3B8">
          ${user.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
        </h6></li>
        <li><hr class="dropdown-divider my-1"></li>
        <li>
          <a class="dropdown-item d-flex align-items-center gap-2" href="#"
             onclick="toggleProfile();return false;">
            <i class="bi bi-person-badge" style="color:#0D7377"></i> Profile
          </a>
        </li>
        <li>
          <a class="dropdown-item d-flex align-items-center gap-2 text-danger" href="#"
             onclick="logout();return false;">
            <i class="bi bi-box-arrow-right"></i> Logout
          </a>
        </li>
      </ul>
    </div>`;
}

/* =============================================
   SECTION 6: PROFILE PANEL
   Slide-in panel with avatar, email, role.
   Avatar icon changes by role (person vs building).
============================================= */
function toggleProfile() {
  const panel    = document.getElementById('profilePanel');
  const backdrop = document.getElementById('profileBackdrop');
  if (!panel) return;

  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    panel.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  } else {
    // Populate panel data before opening
    populateProfilePanel();
    panel.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  }
}

function populateProfilePanel() {
  const user = getUser();
  if (!user) return;

  const avatarEl      = document.getElementById('profileAvatarIcon');
  const emailEl       = document.getElementById('profileEmail');
  const roleBadgeEl   = document.getElementById('profileRoleBadge');
  const emailDetailEl = document.getElementById('profileEmailDetail');
  const roleDetailEl  = document.getElementById('profileRoleDetail');

  const isRecruiter = user.role === 'recruiter';

  // Avatar icon: building for recruiter, person for seeker
  if (avatarEl) {
    avatarEl.innerHTML = isRecruiter
      ? '<i class="bi bi-building-fill"></i>'
      : '<i class="bi bi-person-fill"></i>';
  }

  const roleLabel = isRecruiter ? 'Recruiter' : 'Job Seeker';

  if (emailEl)       emailEl.textContent       = user.email;
  if (roleBadgeEl)   roleBadgeEl.textContent   = roleLabel;
  if (emailDetailEl) emailDetailEl.textContent = user.email;
  if (roleDetailEl)  roleDetailEl.textContent  = roleLabel;
}

/* =============================================
   SECTION 7: BUILD JOB CARD HTML
   Used by both featured grid and browse jobs grid
============================================= */
function buildJobCard(job) {
  const typeCls = {
    'Full-time': 'jtype-full',
    'Part-time':  'jtype-part',
    'Contract':   'jtype-contract',
    'Remote':     'jtype-remote'
  }[job.type] || 'jtype-full';

  const skillPills = job.skills.slice(0, 4)
    .map(s => `<span class="skill-pill">${s}</span>`).join('');

  const featuredBadge = job.featured
    ? `<span class="featured-badge me-1"><i class="bi bi-star-fill me-1"></i>Featured</span>` : '';

  const postedText = job.postedDays === 0 ? 'Just now'
    : job.postedDays === 1 ? '1 day ago'
    : job.postedDays < 7  ? `${job.postedDays} days ago`
    : 'This week';

  return `
    <div class="col-md-6 col-xl-4">
      <div class="job-card ${job.featured ? 'featured-card' : ''} h-100 d-flex flex-column">
        <div class="d-flex gap-3 align-items-start mb-3">
          <div class="job-logo ${job.logoColor}">${job.logo}</div>
          <div class="flex-grow-1 min-w-0">
            <div class="d-flex gap-1 flex-wrap mb-1">
              ${featuredBadge}
              <span class="jtype-badge ${typeCls}">${job.type}</span>
            </div>
            <div class="job-title">${job.title}</div>
            <div class="job-company">${job.company}</div>
          </div>
        </div>
        <div class="job-meta">
          <span class="jm-item"><i class="bi bi-geo-alt"></i>${job.location}</span>
          <span class="jm-item"><i class="bi bi-currency-dollar"></i>${job.salary}</span>
          <span class="jm-item"><i class="bi bi-people"></i>${applicationCounts[job.id]} applicants</span>
          <span class="jm-item"><i class="bi bi-clock"></i>${postedText}</span>
        </div>
        <div class="mb-3">${skillPills}</div>
        <p class="small text-muted mb-3 flex-grow-1"
           style="line-height:1.6;font-size:.82rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
          ${job.description}
        </p>
        <div class="d-flex gap-2 align-items-center justify-content-between">
          <button class="btn-apply" onclick="openApplyModal(${job.id})">
            Apply Now <i class="bi bi-arrow-right ms-1"></i>
          </button>
          <button class="btn-save" id="save-${job.id}" onclick="toggleSave(${job.id}, this)">
            <i class="bi bi-bookmark"></i>
          </button>
        </div>
      </div>
    </div>`;
}

/* =============================================
   SECTION 8: RENDER JOBS GRID
============================================= */
function renderJobsGrid(jobs) {
  const grid  = document.getElementById('jobsGrid');
  const empty = document.getElementById('jobsEmpty');
  const txt   = document.getElementById('jobsResultText');
  if (!grid) return;

  if (jobs.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    if (txt)   txt.innerHTML = '<strong>0</strong> jobs found';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (txt)   txt.innerHTML = `Showing <strong>${jobs.length}</strong> ${jobs.length === 1 ? 'job' : 'jobs'}`;
  grid.innerHTML = jobs.map(buildJobCard).join('');
}

/* =============================================
   SECTION 9: FILTER JOBS
============================================= */
function filterJobs() {
  const skillQ = (document.getElementById('filterSkill')?.value || '').toLowerCase().trim();
  const locQ   = (document.getElementById('filterLoc')?.value   || '').toLowerCase().trim();
  const typeQ  = (document.getElementById('filterType')?.value  || '');
  const sortQ  = (document.getElementById('sortSelect')?.value  || 'default');

  let results = jobsData.filter(job => {
    const skillMatch = !skillQ ||
      job.title.toLowerCase().includes(skillQ) ||
      job.company.toLowerCase().includes(skillQ) ||
      job.skills.some(s => s.toLowerCase().includes(skillQ)) ||
      job.description.toLowerCase().includes(skillQ);

    const locMatch = !locQ ||
      job.location.toLowerCase().includes(locQ) ||
      (locQ === 'remote' && job.type === 'Remote');

    const typeMatch = !typeQ || job.type === typeQ;

    return skillMatch && locMatch && typeMatch;
  });

  if (sortQ === 'newest') {
    results = results.slice().sort((a, b) => a.postedDays - b.postedDays);
  } else if (sortQ === 'salary') {
    results = results.slice().sort((a, b) => b.salaryNum - a.salaryNum);
  }

  renderJobsGrid(results);
}

function clearFilters() {
  ['filterSkill', 'filterLoc', 'filterType', 'sortSelect'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderJobsGrid(jobsData);
}

/* =============================================
   SECTION 10: HERO SEARCH
============================================= */
function heroSearch() {
  const skill = document.getElementById('heroSkill')?.value.trim();
  const loc   = document.getElementById('heroLoc')?.value.trim();
  showSection('jobs');
  setTimeout(() => {
    if (skill) { const el = document.getElementById('filterSkill'); if (el) el.value = skill; }
    if (loc)   { const el = document.getElementById('filterLoc');   if (el) el.value = loc; }
    filterJobs();
  }, 80);
}

function quickSearch(term) {
  showSection('jobs');
  setTimeout(() => {
    const el = document.getElementById('filterSkill');
    if (el) { el.value = term; filterJobs(); }
  }, 80);
}

/* =============================================
   SECTION 11: FEATURED JOBS (Home)
============================================= */
function renderFeaturedJobs() {
  const grid = document.getElementById('featuredJobsGrid');
  if (!grid) return;
  const featured = jobsData.filter(j => j.featured).slice(0, 4);
  grid.innerHTML = featured.map(buildJobCard).join('');
}

/* =============================================
   SECTION 12: APPLY MODAL
============================================= */
function openApplyModal(jobId) {
  currentApplyJobId = jobId;
  const job = jobsData.find(j => j.id === jobId);
  if (!job) return;

  // Populate job info block
  const infoEl = document.getElementById('applyJobInfo');
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="d-flex gap-3 align-items-center">
        <div class="job-logo ${job.logoColor}" style="width:42px;height:42px;font-size:.9rem">${job.logo}</div>
        <div>
          <div class="apply-job-title">${job.title}</div>
          <div class="apply-job-company">${job.company} · ${job.location}</div>
        </div>
      </div>`;
  }

  // Reset form
  ['applyName','applyEmail','applyPhone','applyLinkedin','applyCover'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const msg = document.getElementById('applyMsg');
  if (msg) msg.style.display = 'none';

  new bootstrap.Modal(document.getElementById('applyModal')).show();
}

/* Submit application — saves job to localStorage for Applied Jobs */
function submitApplication() {
  const name  = document.getElementById('applyName')?.value.trim();
  const email = document.getElementById('applyEmail')?.value.trim();

  if (!name || !email) {
    showFormMsg('applyMsg', 'Please fill in your name and email.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showFormMsg('applyMsg', 'Please enter a valid email address.', 'error');
    return;
  }

  if (currentApplyJobId) {
    applicationCounts[currentApplyJobId]++;
    saveAppliedJob(currentApplyJobId); // persist to localStorage
  }

  showFormMsg('applyMsg', "✓ Application submitted! We'll be in touch within 5 business days.", 'success');

  setTimeout(() => {
    bootstrap.Modal.getInstance(document.getElementById('applyModal'))?.hide();
    showToast('Application sent successfully!', 'success');
  }, 1600);
}

/* =============================================
   SECTION 13: APPLIED JOBS — localStorage
   Saves applied job IDs + timestamps.
   Renders the Applied Jobs section.
============================================= */

/* Save an applied job to localStorage */
function saveAppliedJob(jobId) {
  const stored   = JSON.parse(localStorage.getItem('hs_applied') || '[]');
  const exists   = stored.some(entry => entry.id === jobId);
  if (!exists) {
    stored.push({ id: jobId, appliedAt: new Date().toISOString() });
    localStorage.setItem('hs_applied', JSON.stringify(stored));
  }
}

/* Get all applied job entries from localStorage */
function getAppliedEntries() {
  return JSON.parse(localStorage.getItem('hs_applied') || '[]');
}

/* Format relative date */
function relativeDate(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

/* Render the Applied Jobs section */
function renderAppliedJobs() {
  const grid      = document.getElementById('appliedJobsGrid');
  const emptyEl   = document.getElementById('appliedEmpty');
  const summaryEl = document.getElementById('appliedSummaryBar');
  if (!grid) return;

  const entries = getAppliedEntries();

  // Enrich entries with job data
  const appliedJobs = entries
    .map(entry => {
      const job = jobsData.find(j => j.id === entry.id);
      return job ? { ...job, appliedAt: entry.appliedAt } : null;
    })
    .filter(Boolean);

  // Update summary stats
  if (summaryEl) {
    const totalEl  = document.getElementById('appliedTotal');
    const recentEl = document.getElementById('appliedRecent');
    const weekAgo  = Date.now() - 7 * 86400000;
    const recentCount = appliedJobs.filter(j => new Date(j.appliedAt).getTime() > weekAgo).length;
    if (totalEl)  totalEl.textContent  = appliedJobs.length;
    if (recentEl) recentEl.textContent = recentCount;
    summaryEl.style.display = appliedJobs.length > 0 ? 'flex' : 'none';
  }

  if (appliedJobs.length === 0) {
    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  grid.innerHTML = appliedJobs.map(job => {
    const typeCls = {
      'Full-time': 'jtype-full',
      'Part-time':  'jtype-part',
      'Contract':   'jtype-contract',
      'Remote':     'jtype-remote'
    }[job.type] || 'jtype-full';

    const skillPills = job.skills.slice(0, 4)
      .map(s => `<span class="skill-pill">${s}</span>`).join('');

    return `
      <div class="col-md-6 col-xl-4">
        <div class="applied-job-card h-100 d-flex flex-column">
          <!-- Header -->
          <div class="d-flex gap-3 align-items-start mb-3">
            <div class="job-logo ${job.logoColor}">${job.logo}</div>
            <div class="flex-grow-1">
              <div class="job-title">${job.title}</div>
              <div class="job-company">${job.company}</div>
            </div>
            <span class="jtype-badge ${typeCls} ms-auto">${job.type}</span>
          </div>

          <!-- Meta -->
          <div class="job-meta mb-3">
            <span class="jm-item"><i class="bi bi-geo-alt"></i>${job.location}</span>
            <span class="jm-item"><i class="bi bi-currency-dollar"></i>${job.salary}</span>
          </div>

          <!-- Skills -->
          <div class="mb-3">${skillPills}</div>

          <!-- Footer -->
          <div class="d-flex align-items-center justify-content-between mt-auto pt-2"
               style="border-top:1px solid #E2E8F0">
            <span class="applied-status-badge">Applied</span>
            <span class="applied-date"><i class="bi bi-clock me-1"></i>${relativeDate(job.appliedAt)}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

/* =============================================
   SECTION 14: BOOKMARK / SAVE JOB
============================================= */
function toggleSave(jobId, btn) {
  btn.classList.toggle('saved');
  const isSaved = btn.classList.contains('saved');
  btn.innerHTML = isSaved
    ? '<i class="bi bi-bookmark-fill"></i>'
    : '<i class="bi bi-bookmark"></i>';
  showToast(
    isSaved ? 'Job saved to your profile' : 'Job removed from saved',
    isSaved ? 'success' : 'info'
  );
}

/* =============================================
   SECTION 15: RECRUITER — POST JOB
============================================= */
function postJob() {
  const title    = document.getElementById('rTitle')?.value.trim();
  const company  = document.getElementById('rCompany')?.value.trim();
  const location = document.getElementById('rLocation')?.value.trim();
  const type     = document.getElementById('rType')?.value;
  const salary   = document.getElementById('rSalary')?.value.trim();
  const logo     = document.getElementById('rLogo')?.value.trim().toUpperCase() || '??';
  const skillsRaw= document.getElementById('rSkills')?.value.trim();
  const desc     = document.getElementById('rDesc')?.value.trim();

  if (!title || !company || !location || !desc) {
    showFormMsg('recruiterMsg', 'Please fill in all required fields (Title, Company, Location, Description).', 'error');
    return;
  }

  const skills  = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  const colors  = ['logo-blue','logo-purple','logo-orange','logo-green','logo-red','logo-teal','logo-amber'];
  const colorIdx = jobsData.length % colors.length;

  const newJob = {
    id: Date.now(),
    title, company,
    logo: logo.slice(0, 2),
    logoColor: colors[colorIdx],
    location, type,
    salary: salary || 'Competitive',
    salaryNum: 0,
    skills,
    description: desc,
    postedDays: 0,
    featured: false,
    applications: 0
  };

  jobsData.unshift(newJob);
  applicationCounts[newJob.id] = 0;

  showFormMsg('recruiterMsg', `✓ "${title}" at ${company} has been posted! It's now live on Browse Jobs.`, 'success');
  showToast('Job posted successfully!', 'success');
  setTimeout(clearRecruiterForm, 2500);
}

function clearRecruiterForm() {
  ['rTitle','rCompany','rLocation','rSalary','rLogo','rSkills','rDesc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const msg = document.getElementById('recruiterMsg');
  if (msg) msg.style.display = 'none';
}

/* =============================================
   SECTION 16: AI RESUME UPLOAD
   Reads PDF text via PDF.js, detects skills,
   and suggests matching jobs.
============================================= */

// Skills we can detect
const DETECTABLE_SKILLS = [
  'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'rust', 'go', 'ruby', 'swift',
  'react', 'vue', 'angular', 'node', 'django', 'flask', 'express',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis',
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'keras',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd',
  'html', 'css', 'tailwind', 'figma', 'photoshop',
  'excel', 'tableau', 'power bi', 'spark', 'hadoop',
  'graphql', 'rest api', 'microservices'
];

/* Drag-and-drop handlers */
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('resumeDropzone')?.classList.add('drag-over');
}
function handleDragLeave(e) {
  document.getElementById('resumeDropzone')?.classList.remove('drag-over');
}
function handleDrop(e) {
  e.preventDefault();
  const dz = document.getElementById('resumeDropzone');
  if (dz) dz.classList.remove('drag-over');
  const file = e.dataTransfer?.files[0];
  if (file) analyzeResume(file);
}

/* Main resume analysis function */
async function analyzeResume(file) {
  if (!file) {
    // Called without argument — check the file input
    const input = document.getElementById('resumeFileInput');
    file = input?.files[0];
  }
  if (!file) return;

  if (file.type !== 'application/pdf') {
    showResumeStatus('❌ Please upload a PDF file.', 'error');
    return;
  }

  const dz = document.getElementById('resumeDropzone');
  const content = document.getElementById('dropzoneContent');

  // Show uploading state
  if (content) {
    content.innerHTML = `
      <div class="dropzone-icon"><i class="bi bi-arrow-repeat" style="animation:spin .8s linear infinite;display:inline-block"></i></div>
      <div class="dropzone-title">Reading your resume…</div>
      <div class="dropzone-hint">${file.name}</div>`;
  }
  if (dz) dz.classList.add('uploaded');

  showResumeStatus('⏳ Extracting text from PDF…');

  try {
    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    let extractedText = '';

    if (typeof pdfjsLib !== 'undefined') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page    = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => item.str).join(' ') + ' ';
      }
    } else {
      // Fallback: use filename as hint
      extractedText = file.name;
    }

    processResumeText(extractedText, file.name);

  } catch (err) {
    console.error('PDF parse error:', err);
    showResumeStatus('⚠️ Could not read PDF. Showing sample suggestions instead.');
    // Show sample suggestions as fallback
    processResumeText('python react javascript machine learning aws', file.name);
  }
}

/* Detect skills and suggest jobs */
function processResumeText(text, fileName) {
  const lowerText = text.toLowerCase();

  // Detect skills present in the text
  const detected = DETECTABLE_SKILLS.filter(skill => lowerText.includes(skill));

  // Fallback: pick 3 random skills if nothing detected
  const finalSkills = detected.length > 0
    ? detected
    : ['python', 'javascript', 'sql'];

  // Find matching jobs
  const matches = jobsData.filter(job =>
    job.skills.some(s => finalSkills.includes(s.toLowerCase()))
  ).slice(0, 5);

  // Show uploaded state in dropzone
  const content = document.getElementById('dropzoneContent');
  if (content) {
    content.innerHTML = `
      <div class="dropzone-icon" style="color:#16A34A"><i class="bi bi-check-circle-fill"></i></div>
      <div class="dropzone-title" style="color:rgba(255,255,255,.9)">${fileName}</div>
      <div class="dropzone-hint">Upload a different file</div>`;
  }

  // Hide status
  const statusEl = document.getElementById('resumeStatus');
  if (statusEl) statusEl.style.display = 'none';

  // Show detected skills
  const skillsWrap = document.getElementById('detectedSkillsWrap');
  const skillsList = document.getElementById('detectedSkillsList');
  if (skillsWrap && skillsList) {
    skillsList.innerHTML = finalSkills.slice(0, 10)
      .map(s => `<span class="detected-skill-pill">${s}</span>`).join('');
    skillsWrap.style.display = 'block';
  }

  // Show suggested jobs
  renderSuggestedJobs(matches);

  showToast(`${finalSkills.length} skills detected — ${matches.length} jobs matched!`, 'success');
}

function showResumeStatus(msg, type) {
  const el = document.getElementById('resumeStatus');
  if (!el) return;
  el.innerHTML = msg;
  el.style.display = 'flex';
  el.style.background = type === 'error'
    ? 'rgba(220,38,38,0.15)'
    : 'rgba(255,255,255,0.1)';
}

/* Render suggested job cards below the upload area */
function renderSuggestedJobs(jobs) {
  const wrap = document.getElementById('suggestedJobsWrap');
  const grid = document.getElementById('suggestedJobs');
  if (!wrap || !grid) return;

  if (jobs.length === 0) {
    wrap.style.display = 'block';
    grid.innerHTML = '<div style="color:rgba(255,255,255,.5);font-size:.84rem;text-align:center;padding:12px 0">No matching jobs found.</div>';
    return;
  }

  wrap.style.display = 'block';
  grid.innerHTML = jobs.map(job => `
    <div class="suggested-job-card" onclick="openApplyModal(${job.id})">
      <div class="sug-logo logo-${job.logoColor?.replace('logo-','')}">${job.logo}</div>
      <div class="flex-grow-1">
        <div class="sug-title">${job.title}</div>
        <div class="sug-meta">${job.company} · ${job.location}</div>
      </div>
      <div class="sug-salary">${job.salary}</div>
    </div>`).join('');
}

/* =============================================
   SECTION 17: AUTH — Login & Register
============================================= */
function setLoginRole(role) {
  loginRole = role;
  document.getElementById('loginRoleSeeker')   ?.classList.toggle('active', role === 'seeker');
  document.getElementById('loginRoleRecruiter') ?.classList.toggle('active', role === 'recruiter');
}

function setRegRole(role) {
  regRole = role;
  document.getElementById('regRoleSeeker')    ?.classList.toggle('active', role === 'seeker');
  document.getElementById('regRoleRecruiter') ?.classList.toggle('active', role === 'recruiter');
  const companyWrap = document.getElementById('regCompanyWrap');
  if (companyWrap) companyWrap.style.display = role === 'recruiter' ? '' : 'none';
}

function handleLogin() {
  const email = document.getElementById('loginEmail')?.value.trim();
  const pass  = document.getElementById('loginPass')?.value;

  if (!email || !pass) {
    showFormMsg('loginMsg', 'Please enter your email and password.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showFormMsg('loginMsg', 'Please enter a valid email address.', 'error');
    return;
  }

  // Save user to localStorage with role
  const user = { email, role: loginRole };
  localStorage.setItem('hs_user', JSON.stringify(user));

  // Close modal
  bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();

  // Update UI
  buildNavLinks(loginRole);
  showLoggedInUser();
  updateHomeResumeVisibility();
  showToast(`Welcome back! Signed in as ${loginRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}.`, 'success');

  if (loginRole === 'recruiter') {
    setTimeout(() => showSection('recruiter'), 400);
  } else {
    showSection('home');
  }
}

function handleRegister() {
  const first  = document.getElementById('regFirst')?.value.trim();
  const email  = document.getElementById('regEmail')?.value.trim();
  const pass   = document.getElementById('regPass')?.value;
  const terms  = document.getElementById('regTerms')?.checked;

  if (!first || !email || !pass) {
    showFormMsg('registerMsg', 'Please fill in all required fields.', 'error'); return;
  }
  if (!isValidEmail(email)) {
    showFormMsg('registerMsg', 'Please enter a valid email address.', 'error'); return;
  }
  if (pass.length < 8) {
    showFormMsg('registerMsg', 'Password must be at least 8 characters.', 'error'); return;
  }
  if (!terms) {
    showFormMsg('registerMsg', 'Please accept the Terms of Service.', 'error'); return;
  }

  // Save user
  const user = { email, role: regRole };
  localStorage.setItem('hs_user', JSON.stringify(user));

  showFormMsg('registerMsg', `✓ Account created! Welcome to HireSphere 🎉`, 'success');

  setTimeout(() => {
    bootstrap.Modal.getInstance(document.getElementById('registerModal'))?.hide();
    buildNavLinks(regRole);
    showLoggedInUser();
    updateHomeResumeVisibility();
    showToast('Your account is ready. Welcome!', 'success');
    if (regRole === 'recruiter') setTimeout(() => showSection('recruiter'), 400);
    else showSection('home');
  }, 1200);
}

function socialLogin(provider) {
  showToast(`Connecting with ${provider}…`, 'info');
  setTimeout(() => {
    ['loginModal','registerModal'].forEach(id => {
      bootstrap.Modal.getInstance(document.getElementById(id))?.hide();
    });
    // Default to seeker for social login
    const user = { email: `user@${provider.toLowerCase()}.com`, role: loginRole };
    localStorage.setItem('hs_user', JSON.stringify(user));
    buildNavLinks(loginRole);
    showLoggedInUser();
    showToast(`Signed in with ${provider}! Welcome back 👋`, 'success');
  }, 1400);
}

function logout() {
  localStorage.removeItem('hs_user');
  localStorage.removeItem('hs_applied');
  location.reload();
}

/* =============================================
   SECTION 18: PASSWORD HELPERS
============================================= */
function checkPassStrength(val) {
  const fill  = document.getElementById('passStrengthFill');
  const label = document.getElementById('passStrengthLabel');
  if (!fill || !label) return;

  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;

  const pct    = score * 25;
  const colors = ['#E11D48', '#D97706', '#2563EB', '#16A34A'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  fill.style.width      = pct + '%';
  fill.style.background = colors[score - 1] || '#E2E8F0';
  label.textContent     = val ? (labels[score - 1] || 'Very weak') : 'Enter a password';
  label.style.color     = colors[score - 1] || '#94A3B8';
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<i class="bi bi-eye"></i>'
    : '<i class="bi bi-eye-slash"></i>';
}

/* =============================================
   SECTION 19: UTILITIES
============================================= */
function getUser() {
  try { return JSON.parse(localStorage.getItem('hs_user')); }
  catch { return null; }
}

function showFormMsg(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent   = text;
  el.className     = `form-msg ${type}`;
  el.style.display = 'block';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `hs-toast toast-${type}`;
  toast.innerHTML = `
    <span style="font-weight:700;font-size:1rem">${icons[type] || '●'}</span>
    <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity .35s, transform .35s';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateY(8px)';
    setTimeout(() => toast.remove(), 380);
  }, 3200);
}

/* Add CSS spin keyframe dynamically for upload icon */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
document.head.appendChild(spinStyle);

/* =============================================
   SECTION 20: INIT
   Run on DOMContentLoaded
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  const user = getUser();

  if (user) {
    buildNavLinks(user.role);
    showLoggedInUser();
    updateHomeResumeVisibility();
    showSection('home');
  } else {
    buildNavLinks('guest');
    updateHomeResumeVisibility();
    showSection('home');
    setTimeout(() => {
      if (!getUser()) {
        new bootstrap.Modal(document.getElementById('loginModal')).show();
      }
    }, 600);
  }

  // Hero search: Enter key support
  const heroSkill = document.getElementById('heroSkill');
  const heroLoc   = document.getElementById('heroLoc');
  if (heroSkill) heroSkill.addEventListener('keypress', e => { if (e.key === 'Enter') heroSearch(); });
  if (heroLoc)   heroLoc.addEventListener('keypress',   e => { if (e.key === 'Enter') heroSearch(); });

  // Filter: Enter key support
  const filterSkill = document.getElementById('filterSkill');
  if (filterSkill) filterSkill.addEventListener('keypress', e => { if (e.key === 'Enter') filterJobs(); });

  // Close profile panel on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const panel = document.getElementById('profilePanel');
      if (panel?.classList.contains('open')) toggleProfile();
    }
  });
});

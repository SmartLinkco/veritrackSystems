// Marketing copy, ported from WEBSITE_CONTENT_STRATEGY.md §6–7 and the live site.
// Keep claims here verifiable; see the strategy doc's content principles.

import { TRIAL_DAYS } from "./pricing";

export type SectorSlug = "pharmacy" | "education" | "logistics" | "corporate" | "security" | "events";

export type Sector = {
  slug: SectorSlug;
  name: string;
  short: string;
  pitch: string;
  heroAngle: string;
  painPoints: string[];
  features: { title: string; body: string }[];
  exclusive: { title: string; body: string };
  screenshot: { src: string; alt: string; width: number; height: number };
};

const dashboardShot = { src: "/product/dashboard.jpg", alt: "VeriTrack attendance analytics dashboard with daily attendance rate, late arrivals and by-branch charts", width: 2880, height: 1640 };
const mapShot = { src: "/product/super-admin.jpg", alt: "VeriTrack live attendance map showing geofenced office locations across Accra", width: 2880, height: 1638 };
const performanceShot = { src: "/product/performance.jpg", alt: "VeriTrack performance dashboard ranking organisations by Performance Score", width: 2880, height: 1636 };

export const sectors: Sector[] = [
  {
    slug: "pharmacy",
    name: "Pharmacy & healthcare",
    short: "Multi-branch, audit-ready.",
    pitch: "Know which pharmacist was on duty at every branch and every hour, with a photo-verified attendance log ready for any audit.",
    heroAngle: "Every shift covered. Every branch audit-ready.",
    painPoints: [
      "Paper registers at each branch that head office never sees until month-end",
      "No proof a pharmacist was actually on site for the hours claimed",
      "Branch managers reporting attendance in different formats",
    ],
    features: [
      { title: "Branch-level geofences", body: "Each pharmacy location is registered with its own coordinates, so a check-in only counts on site." },
      { title: "Department filters", body: "Separate dispensary, sales floor, and back-office staff in every report." },
      { title: "Audit-friendly logs", body: "Timestamped, photo-verified records that stand up when a shift is disputed." },
    ],
    exclusive: {
      title: "Compliance and subscription alerts",
      body: "Admins get notified about missing check-ins and incomplete checkouts the same day, plus advance notice before a subscription lapses, so registers never go dark.",
    },
    screenshot: mapShot,
  },
  {
    slug: "education",
    name: "Education & colleges",
    short: "Staff, classes, campus analytics.",
    pitch: "Staff and lesson attendance with photo and location proof, plus class sessions, lecturer assignments and campus-wide analytics.",
    heroAngle: "Know the teacher was in the classroom, not just on the register.",
    painPoints: [
      "Lecturer attendance tracked separately from class registers",
      "Sign-in sheets that are easy to fill in for someone else",
      "No campus-wide view of who taught, who attended, and when",
    ],
    features: [
      { title: "College mode", body: "Class and course sessions with lecturer assignments, alongside general staff attendance." },
      { title: "Student registers", body: "Dedicated student check-in and scanner flows for sessions." },
      { title: "Campus analytics", body: "Attendance by department, course, and lecturer, rolled up for leadership." },
    ],
    exclusive: {
      title: "Campus analytics",
      body: "See class attendance quality and lecturer punctuality side by side, the same data that feeds the Education & Campus Leadership award at VGBA.",
    },
    screenshot: dashboardShot,
  },
  {
    slug: "logistics",
    name: "Logistics & field teams",
    short: "Geofenced sites. Offline sync.",
    pitch: "Drivers, reps and warehouse staff check in at geofenced sites from their own phones. Offline check-ins sync as soon as the signal returns.",
    heroAngle: "Prove every field visit, even where the signal drops.",
    painPoints: [
      "Drivers and riders checking in from wherever they happen to be",
      "Warehouses and depots with patchy connectivity",
      "Supervisors phoning around each morning to see who turned up",
    ],
    features: [
      { title: "Offline queue", body: "Check-ins are captured on the device and synced when connectivity returns, keeping the audit trail intact." },
      { title: "Any phone", body: "A browser-based portal, so there's nothing to install and no hardware to buy." },
      { title: "Multi-site geofencing", body: "Depots, hubs, and offices each get their own radius." },
    ],
    exclusive: {
      title: "Live geofence map",
      body: "Every registered site appears on a live map with today's check-ins, check-outs, and missing staff, so dispatch knows who's on site before the first run.",
    },
    screenshot: mapShot,
  },
  {
    slug: "corporate",
    name: "Corporate & multi-branch HQ",
    short: "Executive view. Payroll-ready exports.",
    pitch: "One live view of attendance across every entity, branch and department, with reports ready before payroll asks for them.",
    heroAngle: "See who showed up at every branch, without calling each one.",
    painPoints: [
      "Each subsidiary or branch running its own attendance process",
      "HR rebuilding the same report every month for payroll",
      "Leadership with no live view of headcount across locations",
    ],
    features: [
      { title: "Executive roll-up", body: "Live headcount, lateness, and checkout completion across every location." },
      { title: "Automated reporting", body: "Daily, weekly, and monthly rollups by branch, department, and role." },
      { title: "Payroll-ready exports", body: "Structured exports by default; direct payroll sync is an optional add-on." },
    ],
    exclusive: {
      title: "Multi-entity command view",
      body: "Holding companies and franchises can switch from a network-wide overview to a single company's full dashboard in one click.",
    },
    screenshot: performanceShot,
  },
  {
    slug: "security",
    name: "Security & guarding",
    short: "Guards on post, proven per client site.",
    pitch: "Geofenced post check-ins and shift handovers for guard companies, with a coverage report your clients can trust.",
    heroAngle: "Proof your guards were on post, at every client site.",
    painPoints: [
      "Guards signing a book at the gate for colleagues who never arrived",
      "Night shifts nobody can verify until a client complains",
      "Disputes over coverage with only a paper log to show",
    ],
    features: [
      { title: "Geofenced post check-ins", body: "A guard can only check in with a live photo from inside the site's geofence." },
      { title: "Shift handovers on record", body: "Check-out and check-in times show whether every post was covered between shifts." },
      { title: "Per-site attendance", body: "Every client site as its own branch, with daily, weekly and monthly summaries." },
    ],
    exclusive: {
      title: "A coverage report clients accept",
      body: "Share each client the verified attendance for their sites, with photo and location behind every entry, instead of a signed logbook.",
    },
    screenshot: mapShot,
  },
  {
    slug: "events",
    name: "Events & conferences",
    short: "Delegate check-in, same engine.",
    pitch: "Registration and on-site check-in for delegates, so you know who attended each session, on the same platform as your staff attendance.",
    heroAngle: "Know who actually attended, not just who registered.",
    painPoints: [
      "Queues at registration desks with printed lists",
      "No reliable count of who actually attended each session",
      "Separate tools for staff attendance and event check-in",
    ],
    features: [
      { title: "Registration and on-site check-in", body: "Delegates register ahead and check in on arrival." },
      { title: "Session attendance", body: "Know who attended which session, not just who picked up a badge." },
      { title: "Visitor management", body: "Extend gate control beyond staff to visitors and guests." },
    ],
    exclusive: {
      title: "Beyond daily staff attendance",
      body: "Organisations already on VeriTrack can add event and visitor check-in as a scoped add-on without onboarding a second vendor.",
    },
    screenshot: dashboardShot,
  },
];

export const pillars = [
  {
    id: "verify",
    label: "Verify",
    title: "Staff Portal (PWA)",
    summary: "Live photo + GPS. Any phone. Works offline.",
    body: "Staff check in and out from any phone: live photo with liveness detection, GPS validation, an optional offline queue, and instant confirmations. No hardware turnstiles required.",
    capabilities: ["Live photo with liveness detection", "GPS geofence validation (typically within 50m)", "Offline queue with sync", "Instant check-in confirmations", "Portals in multiple languages"],
    image: { src: "/product/staff-portal.png", alt: "VeriTrack staff portal on a phone: Staff ID field, Check-In and Check-Out buttons, and the before-you-begin checklist", width: 828, height: 1792 },
  },
  {
    id: "monitor",
    label: "Monitor",
    title: "Admin Dashboard",
    summary: "Who's on site, who's late, who never checked out. Live.",
    body: "Branch maps, live headcount, missing check-ins, incomplete checkouts, daily/weekly/monthly reports, and role-based analytics, scoped to your organisation.",
    capabilities: ["Live headcount and branch map", "Missing check-ins and incomplete checkouts", "Daily, weekly and monthly reports", "Role-based access", "Payroll-ready exports"],
    image: dashboardShot,
  },
  {
    id: "improve",
    label: "Improve",
    title: "Network Intelligence",
    summary: "Performance scores across your network, and VGBA rankings.",
    body: "VeriTrack's super-admin layer benchmarks attendance health across clients (with consent), powering sector insights and the VeriTrack Global Business Awards.",
    capabilities: ["Composite Performance Score (0–100)", "Cross-company KPIs", "Benchmarks by sector and size", "One-click drill-down to any company", "Feeds VGBA rankings"],
    image: performanceShot,
  },
] as const;

export const capabilities = [
  { title: "Real-time photo verification", body: "Every check-in can require a live capture with liveness detection, reducing buddy punching and disputed records." },
  { title: "Precision geofencing", body: "Attendance is validated against registered office coordinates (typically within 50m), so on site means on site." },
  { title: "Offline-ready portals", body: "Field and low-connectivity environments queue check-ins until the device is back online, without losing audit trail integrity." },
  { title: "Automated reporting", body: "Daily, weekly, and monthly rollups by branch, department, and role, ready for HR review and payroll preparation." },
  { title: "Multi-location by design", body: "Pricing and architecture scale by branch; central leadership sees every location from one dashboard." },
  { title: "Workforce engagement (optional)", body: "Daily role-aware tips and recognition for teams that want growth content alongside attendance." },
];

export const performanceWeights = [
  { key: "attendance", label: "Attendance rate", weight: 50 },
  { key: "punctuality", label: "Punctuality", weight: 30 },
  { key: "checkout", label: "Checkout completion", weight: 15 },
  { key: "sync", label: "Online sync reliability", weight: 5 },
] as const;

export const faqs = [
  { q: "What does it cost?", a: `From GHS 300 per branch per month, with 12 staff included per branch. There is a one-time GHS 500 setup, then a ${TRIAL_DAYS}-day trial before your subscription starts.` },
  { q: "Do you work outside Ghana?", a: "Yes. VeriTrack runs in the cloud and works on any smartphone with GPS, so we can deploy for teams in any country. Our team in Accra onboards you remotely, and outside Ghana we quote in your local currency or US dollars." },
  { q: "Do we need to buy hardware?", a: "No. Staff check in from their own phones through your branded portal, so there are no biometric devices or turnstiles to buy, install or repair." },
  { q: "How does photo verification work?", a: "At check-in/out the portal can require a live selfie validated for liveness (not a gallery upload), combined with staff ID and location checks." },
  { q: "Does VeriTrack work offline?", a: "Yes. Portals queue check-ins when offline and sync when connectivity returns, subject to your configured rules." },
  { q: "Can we manage many branches?", a: "Yes. Dashboards aggregate by branch with map views; pricing scales by branch count." },
  { q: "Is data secure?", a: "Yes. Access to attendance data is role-restricted, and VeriTrack is approved and certified by Ghana's Data Protection Commission (DPC). See our privacy policy for details." },
  { q: "Do you integrate with payroll?", a: "Reports are payroll-ready; direct payroll integration is an optional add-on or custom project." },
  { q: "What support is included?", a: "Dedicated support during business hours with defined response targets. Contact us for current SLA details." },
  { q: "What is VGBA?", a: "The VeriTrack Global Business Awards recognise client organisations with outstanding attendance performance across metrics we already track: attendance rate, punctuality, checkout discipline, and data reliability." },
  { q: "How do I get started?", a: `Submit a deployment request, try the live demo, or book a walkthrough. Setup is a one-time configuration fee plus a ${TRIAL_DAYS}-day trial on subscription.` },
];

export type Testimonial = { quote: string; name: string; role: string; sector: "Corporate" | "Logistics" | "Retail" };

export const testimonials: Testimonial[] = [
  {
    quote: "Attendance used to be something HR pieced together after the fact. Now we see check-ins as they come in, and staff do it themselves on their phones. It has changed how we run things.",
    name: "Shola Oluwa",
    role: "Managing Director, REXDELIVERY GHANA LTD (17 employees)",
    sector: "Logistics",
  },
  {
    quote: "I don’t build attendance reports anymore. They arrive with everything I need already in them.",
    name: "Stephen Darry Oppong",
    role: "CEO, DEDARRYS CONSULT (30 employees)",
    sector: "Corporate",
  },
  {
    quote: "We had people signing in for each other. Once a check-in needed a photo and the location, that stopped. By our own estimate, that’s over ₵10,000 a year we were paying for time nobody worked.",
    name: "Adelaide Troko",
    role: "Operations Manager, Confidential retail client, Ghana (8 branches, NDA)",
    sector: "Retail",
  },
];

// photo: null shows an initials tile until a portrait is added to public/team.
export const team: { name: string; role: string; photo: string | null }[] = [
  { name: "Stephen Gyan Bimpong", role: "Founder & CEO", photo: "/team/stephen.jpg" },
  { name: "Felix Kwesi Selassie", role: "Chief Operating Officer", photo: "/team/felix.jpg" },
  { name: "Godfred Tenkorang", role: "Chief Technology Officer", photo: "/team/godfred.jpg" },
  { name: "Emmanuella B. Owusu", role: "Marketing Lead", photo: "/team/emmanuella.jpg" },
  { name: "Muhammad Tawfiq Labib Ladan", role: "Software Engineer", photo: "/team/muhammad.jpg" },
];

export const deploySteps = [
  { title: "Submit your requirements", body: "Branch count, sector, admin contacts." },
  { title: "Discovery call", body: "We confirm locations, shifts, and dashboard scope." },
  { title: "Configuration & UAT", body: "Portal URL, branding, test check-ins." },
  { title: "Go live", body: "Staff onboarding pack, admin credentials, support channel." },
];

export const awardSteps = [
  { title: "Measure", body: "Track attendance rate, punctuality, checkout completion, and sync reliability all year." },
  { title: "Rank", body: "A Performance Score (0–100) identifies top performers by sector and size band." },
  { title: "Recognise", body: "Winners receive portal badges, press releases, and optional case features." },
  { title: "Improve", body: "Every client gets benchmark insights. The programme drives improvement, not just ceremony." },
];

export const awardCategories = [
  { title: "Enterprise Excellence", body: "Top Performance Score among enterprise portal clients." },
  { title: "Education & Campus Leadership", body: "Top among college portals, including class attendance where enabled." },
  { title: "Punctuality Award", body: "Lowest sustained late-rate among qualifying clients." },
  { title: "Operational Integrity", body: "Best checkout completion and online sync reliability." },
];

export const awardSafeguards = [
  "Active subscription and a minimum data window are required (e.g. 9 months of eligible logs).",
  "Clients may opt out of public ranking while remaining in private benchmarks.",
  "VeriTrack staff and demo tenants are excluded.",
];

// Client logos for the homepage marquee, hosted on Cloudinary (same files as the legacy site's trusted-brands strip).
// width/height are each file’s real size at the 160px height requested, so the row reserves space before the logos load.
// trim crops away a plain border, for logos saved with a lot of empty space around them.
const cloudinary = (path: string, trim = false) => `https://res.cloudinary.com/dgp5xrels/image/upload/${trim ? "e_trim/" : ""}f_auto,q_auto,h_160,c_fit/${path}`;
export const clientLogos: { name: string; src: string; width: number; height: number }[] = [
  { name: "Pharma Trust Limited", src: cloudinary("v1775920967/WhatsApp_Image_2026-04-11_at_10.34.04_ihufjx.jpg"), width: 160, height: 160 },
  { name: "Ga East Municipal Assembly", src: cloudinary("v1771200666/GA-EAST_LOGO_jo489n.jpg"), width: 160, height: 160 },
  { name: "Phersons Pharmacy Ltd", src: cloudinary("v1779295780/pherson_s_logo_sbx7nl.png"), width: 226, height: 160 },
  { name: "Pharma Trust Professional College", src: cloudinary("v1778738384/ppc-logo_cemrx0.png"), width: 177, height: 160 },
  { name: "Phinies", src: cloudinary("v1768689246/cropped_logo_phinies_obyotv.png"), width: 453, height: 160 },
  { name: "Dedarrys Consult", src: cloudinary("v1755217616/Screenshot_2025-08-15_002254-removebg-preview_vjb7kf.png"), width: 186, height: 160 },
  { name: "XTENDED", src: cloudinary("v1753432192/xtended_web_s4bluf.png"), width: 139, height: 160 },
  { name: "DFE", src: cloudinary("v1752847081/DFE_logo_j6odmr.png"), width: 150, height: 160 },
  { name: "Partner school crest", src: cloudinary("v1761097488/download__5_-removebg-preview_iyo0a8.png"), width: 160, height: 160 },
  { name: "FinanceGuard", src: cloudinary("v1765720387/financeGuard_thnxzq.png"), width: 160, height: 160 },
  { name: "Westfield Montessori School", src: cloudinary("v1770585429/westfield_logo_uebjpq.jpg"), width: 162, height: 160 },
  { name: "J.A. Biney & Co. Ltd", src: cloudinary("v1785499878/J.A_Biney_Co_Logo_i9fvdq.png"), width: 302, height: 160 },
  { name: "Star Gas", src: cloudinary("v1784642196/star_gas_logo_lkk8yy.png"), width: 220, height: 160 },
  { name: "Prime Pak Canning Ltd", src: cloudinary("v1783021767/primepakcanningltd_logo_titctp.jpg", true), width: 336, height: 160 },
  { name: "Kamak Paperless", src: cloudinary("v1782337178/kamak-logo_sajipq.webp"), width: 444, height: 160 },
  { name: "University Practice Senior High School", src: cloudinary("v1767029021/University_Practice_qy7fhc.png"), width: 179, height: 160 },
];

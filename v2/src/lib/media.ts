// Footage and films used across the site. Loops are cut by scripts/build-media.mjs; stock clips that
// have not been added yet fall back to footage from the VeriTrack commercial.
import manifest from "./media-manifest.json";

export type LoopKey =
  | "register"
  | "office-checkin"
  | "laptop"
  | "event-hall"
  | "accra-square"
  | "accra-road"
  | "classroom"
  | "teacher"
  | "office-team"
  | "delivery"
  | "selfie-checkin";

export type Loop = { key: LoopKey; webm: string; mp4: string; poster: string };

const fallbacks: Record<LoopKey, LoopKey> = {
  register: "register",
  "office-checkin": "office-checkin",
  laptop: "laptop",
  "event-hall": "event-hall",
  "accra-square": "office-checkin",
  "accra-road": "event-hall",
  classroom: "register",
  teacher: "register",
  "office-team": "laptop",
  delivery: "office-checkin",
  "selfie-checkin": "office-checkin",
};

const built = new Set<string>(manifest.loops);

export function loop(key: LoopKey): Loop {
  const k = built.has(key) ? key : fallbacks[key];
  return { key: k, webm: `/media/loops/${k}.webm`, mp4: `/media/loops/${k}.mp4`, poster: `/media/loops/${k}.jpg` };
}

export type FilmId = "K8QZyf5AAkM" | "K6jzxsHeqlI" | "NMK83-bHkAc" | "TqbSissE_q8" | "SGO8I0AXpQ4";

export type Film = { id: FilmId; title: string; hook: string; audience: string; poster: string };

export const films: Record<FilmId, Film> = {
  K8QZyf5AAkM: {
    id: "K8QZyf5AAkM",
    title: "VeriTrack in 60 seconds",
    hook: "From staff registration to payroll-ready reports.",
    audience: "Full demo",
    poster: "/media/films/K8QZyf5AAkM.jpg",
  },
  K6jzxsHeqlI: {
    id: "K6jzxsHeqlI",
    title: "Who really showed up today?",
    hook: "Staff attendance for multi-branch businesses.",
    audience: "Multi-branch businesses",
    poster: "/media/films/K6jzxsHeqlI.jpg",
  },
  "NMK83-bHkAc": {
    id: "NMK83-bHkAc",
    title: "The teacher signed in. The class never started.",
    hook: "Staff and lesson attendance for schools.",
    audience: "Schools",
    poster: "/media/films/NMK83-bHkAc.jpg",
  },
  TqbSissE_q8: {
    id: "TqbSissE_q8",
    title: "Are your sales reps really at the outlet?",
    hook: "Field team tracking that proves visits.",
    audience: "Field sales teams",
    poster: "/media/films/TqbSissE_q8.jpg",
  },
  SGO8I0AXpQ4: {
    id: "SGO8I0AXpQ4",
    title: "Were your guards there?",
    hook: "Guard attendance for security firms, across every client site.",
    audience: "Security firms",
    poster: "/media/films/SGO8I0AXpQ4.jpg",
  },
};

export const sectorFilms: FilmId[] = ["SGO8I0AXpQ4", "NMK83-bHkAc", "TqbSissE_q8", "K6jzxsHeqlI"];

export const filmEmbedUrl = (id: FilmId) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

/** Footage behind each sector hero, and the sector's film where one exists. */
export const sectorMedia: Record<string, { loop: LoopKey; film?: FilmId }> = {
  pharmacy: { loop: "register" },
  education: { loop: "classroom", film: "NMK83-bHkAc" },
  logistics: { loop: "delivery", film: "TqbSissE_q8" },
  corporate: { loop: "office-team", film: "K6jzxsHeqlI" },
  security: { loop: "office-checkin", film: "SGO8I0AXpQ4" },
  events: { loop: "event-hall" },
};

const SHARED_DIRECTIVES = {
  "default-src": ["'self'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://firebasestorage.googleapis.com",
    "https://*.firebasestorage.app",
    "https://*.googleusercontent.com",
  ],
  "font-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "manifest-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "frame-src": [
    "'self'",
    "https://www.google.com",
    "https://maps.google.com",
    "https://*.google.com",
  ],
} as const;

const FIREBASE_CONNECT = [
  "https://*.googleapis.com",
  "https://firestore.googleapis.com",
  "https://*.firebaseio.com",
  "wss://*.firebaseio.com",
  "https://identitytoolkit.googleapis.com",
  "https://securetoken.googleapis.com",
];

const EMULATOR_CONNECT = [
  "http://localhost:*",
  "http://127.0.0.1:*",
  "ws://localhost:*",
  "ws://127.0.0.1:*",
];

function joinDirective(name: string, values: readonly string[]): string {
  return `${name} ${values.join(" ")}`;
}

function buildDirectiveBlock(
  scriptSrc: readonly string[],
  connectSrc: readonly string[],
  extra: string[] = [],
): string {
  return [
    joinDirective("default-src", SHARED_DIRECTIVES["default-src"]),
    joinDirective("script-src", scriptSrc),
    joinDirective("style-src", SHARED_DIRECTIVES["style-src"]),
    joinDirective("img-src", SHARED_DIRECTIVES["img-src"]),
    joinDirective("font-src", SHARED_DIRECTIVES["font-src"]),
    joinDirective("connect-src", connectSrc),
    joinDirective("frame-src", SHARED_DIRECTIVES["frame-src"]),
    joinDirective("object-src", SHARED_DIRECTIVES["object-src"]),
    joinDirective("base-uri", SHARED_DIRECTIVES["base-uri"]),
    joinDirective("form-action", SHARED_DIRECTIVES["form-action"]),
    joinDirective("manifest-src", SHARED_DIRECTIVES["manifest-src"]),
    joinDirective("worker-src", SHARED_DIRECTIVES["worker-src"]),
    ...extra,
  ].join("; ");
}

/** Enforced in production — no unsafe-eval (not needed outside dev HMR). */
export function buildProductionContentSecurityPolicy(): string {
  return buildDirectiveBlock(
    [
      "'self'",
      "'unsafe-inline'",
      "https://apis.google.com",
      "https://*.firebaseapp.com",
    ],
    ["'self'", ...FIREBASE_CONNECT],
    ["upgrade-insecure-requests"],
  );
}

/** Report-only in development — allows HMR and Firebase emulator. */
export function buildDevelopmentContentSecurityPolicy(): string {
  return buildDirectiveBlock(
    [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://apis.google.com",
      "https://*.firebaseapp.com",
    ],
    ["'self'", ...FIREBASE_CONNECT, ...EMULATOR_CONNECT],
  );
}

export const CSP_HEADER_ENFORCE = "Content-Security-Policy";
export const CSP_HEADER_REPORT_ONLY = "Content-Security-Policy-Report-Only";

const CURRENT_ROUTE_KEY = "minidoge:currentRoute";
const PREVIOUS_ROUTE_KEY = "minidoge:previousRoute";
const LAST_GALLERY_URL_KEY = "minidoge:lastGalleryUrl";
const DOC_ID_KEY = "minidoge:docId";

function readStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

function ensureCurrentDocumentScope(storage: Storage): void {
  const currentDocId = String(window.performance.timeOrigin);
  const storedDocId = storage.getItem(DOC_ID_KEY);

  if (storedDocId !== currentDocId) {
    storage.setItem(DOC_ID_KEY, currentDocId);
    storage.removeItem(CURRENT_ROUTE_KEY);
    storage.removeItem(PREVIOUS_ROUTE_KEY);
  }
}

export function trackRoute(route: string): void {
  const storage = readStorage();
  if (!storage) return;

  ensureCurrentDocumentScope(storage);

  const currentRoute = storage.getItem(CURRENT_ROUTE_KEY);
  if (currentRoute && currentRoute !== route) {
    storage.setItem(PREVIOUS_ROUTE_KEY, currentRoute);
  }

  storage.setItem(CURRENT_ROUTE_KEY, route);

  if (route === "/" || route.startsWith("/?")) {
    storage.setItem(LAST_GALLERY_URL_KEY, route);
  }
}

export function getPreviousRoute(): string | null {
  const storage = readStorage();
  if (!storage) return null;

  ensureCurrentDocumentScope(storage);
  return storage.getItem(PREVIOUS_ROUTE_KEY);
}

export function getLastGalleryRoute(): string | null {
  const storage = readStorage();
  if (!storage) return null;

  ensureCurrentDocumentScope(storage);
  return storage.getItem(LAST_GALLERY_URL_KEY);
}

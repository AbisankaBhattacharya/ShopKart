const AUTH_STORAGE_KEY = "shopkart.auth";
export const AUTH_UNAUTHORIZED_EVENT = "shopkart:unauthorized";

export const getTokenExpiresAt = (token) => {
  try {
    const encodedPayload = token.split(".")[1];
    const base64Payload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = base64Payload.padEnd(Math.ceil(base64Payload.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedPayload));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const expiresAt = getTokenExpiresAt(token);
  return !expiresAt || expiresAt <= Date.now();
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredAuth = () => {
  try {
    const storedAuth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));

    if (!storedAuth?.token || !storedAuth?.user || isTokenExpired(storedAuth.token)) {
      clearStoredAuth();
      return null;
    }

    return storedAuth;
  } catch {
    clearStoredAuth();
    return null;
  }
};

export const getStoredToken = () => getStoredAuth()?.token ?? null;

export const storeAuth = (auth) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const notifyUnauthorized = () => {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
};

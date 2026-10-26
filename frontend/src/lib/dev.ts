// Local UI work without Google credentials. Ignored unless Next runs in development mode.
export const devAuthBypass = process.env.NODE_ENV === "development" && process.env.DEV_AUTH_BYPASS === "true";

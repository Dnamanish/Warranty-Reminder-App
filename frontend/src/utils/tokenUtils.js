export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payloadPart = token.split(".")[1];

    if (!payloadPart) return true;

    // Convert Base64URL to Base64
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    const payload = JSON.parse(atob(paddedBase64));

    if (!payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  } catch (err) {
    console.error("Token parse error:", err);
    return true;
  }
};

export const logout = (redirectTo = "/login") => {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");

  window.location.href = redirectTo;
};

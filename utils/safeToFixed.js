export const safeToFixed = (value, digits = 2, fallback = "N/A") => {
  try {
    return Number(value).toFixed(digits);
  } catch (error) {
    console.error("Error formatting number:", error);
    return fallback;
  }
};

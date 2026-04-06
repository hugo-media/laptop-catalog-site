export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Return admin login page path instead of OAuth URL
export const getLoginUrl = () => {
  return "/admin";
};

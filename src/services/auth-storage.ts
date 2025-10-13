/**
 * Auth Storage Service
 *
 * Manages non-sensitive user information storage in localStorage.
 *
 * IMPORTANT: This module only handles non-sensitive user data (name, email, role).
 * Authentication tokens are managed separately by auth.ts service.
 * NEVER store passwords, tokens, or other sensitive data here.
 */

export interface UserInfo {
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
}

const USER_INFO_KEY = "user-info";

/**
 * Stores user information in localStorage
 *
 * @param user - Non-sensitive user data (name, email, role)
 */
export function setUserInfo(user: UserInfo): void {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user info to localStorage:", error);
  }
}

/**
 * Retrieves user information from localStorage
 *
 * @returns User info or null if not found
 */
export function getUserInfo(): UserInfo | null {
  try {
    const userInfo = localStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to read user info from localStorage:", error);
    return null;
  }
}

/**
 * Removes user information from localStorage
 */
export function clearUserInfo(): void {
  try {
    localStorage.removeItem(USER_INFO_KEY);
  } catch (error) {
    console.error("Failed to clear user info from localStorage:", error);
  }
}

/**
 * Checks if user information exists in localStorage
 *
 * @returns true if user info exists, false otherwise
 */
export function hasUserInfo(): boolean {
  return getUserInfo() !== null;
}

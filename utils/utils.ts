import moment from "moment";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Returns a formatted date string based on the provided timestamp.
 * @param {string} timestamp - The timestamp to format.
 * @returns {string} The formatted date string.
 */
export function getFormattedDate(timestamp: string): string {
  const date = moment(timestamp);
  const isToday = date.isSame(moment(), "day");

  return isToday
    ? `Today at ${date.format("h:mm A")}`
    : `${date.format("dddd")} at ${date.format("h:mm A")}`;
}

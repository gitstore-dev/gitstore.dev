/**
 * Checks if honeypot field is filled (indicates bot)
 * @param value - Value of the honeypot field
 * @returns true if bot detected (field is filled), false if human (field is empty)
 */
export function isBotDetected(value: string): boolean {
  return value !== '';
}

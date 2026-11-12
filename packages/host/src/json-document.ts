/**
 * The reading two document validators share: what a JSON value is once it has
 * been parsed, asked the same way everywhere.
 *
 * The price snapshot and its like are documents with the
 * same job — a third party's or a build step's JSON that must be held to a shape
 * before anything judges by it — so every check starts from the same question.
 */

/** One object's members, or null when the value is not one. */
export function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}

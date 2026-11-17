/** The message of a caught value, which need not be an Error. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

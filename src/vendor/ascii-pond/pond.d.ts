// The part of pond.js this site calls; the options are documented in pond.js itself.
export function mount(
  target: Element,
  options?: Record<string, unknown>,
): { setTheme(isLight: boolean): void; destroy(): void }

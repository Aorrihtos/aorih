export type StatRange = {
  min: number;
  max: number;
};

/**
 * Values behind the game-like status bar in the footer. `level` is derived from
 * `birthDate`; `hp` and `ap` are rolled within their range on every visit.
 */
export type SiteSettings = {
  email: string;
  /** ISO date (YYYY-MM-DD). */
  birthDate: string;
  hp: StatRange;
  ap: StatRange;
};

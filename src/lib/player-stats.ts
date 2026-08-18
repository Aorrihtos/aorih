import type { StatRange } from '@/domain/site-settings';

const parseIsoDate = (iso: string): Date => {
  const [year = '0', month = '1', day = '1'] = iso.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const hasHadBirthdayThisYear = (now: Date, birth: Date): boolean =>
  now.getMonth() > birth.getMonth() ||
  (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

/** The footer LEVEL: how many years old the subject is right now. */
export const calculateLevel = (birthDate: string, now: Date = new Date()): number => {
  const birth = parseIsoDate(birthDate);
  const years = now.getFullYear() - birth.getFullYear();
  return hasHadBirthdayThisYear(now, birth) ? years : years - 1;
};

/** Percentage (0-100) of the way from the last birthday to the next one. */
export const calculateBirthdayProgress = (birthDate: string, now: Date = new Date()): number => {
  const birth = parseIsoDate(birthDate);
  const lastBirthdayYear = now.getFullYear() - (hasHadBirthdayThisYear(now, birth) ? 0 : 1);
  const previous = new Date(lastBirthdayYear, birth.getMonth(), birth.getDate());
  const next = new Date(lastBirthdayYear + 1, birth.getMonth(), birth.getDate());
  const elapsed = (now.getTime() - previous.getTime()) / (next.getTime() - previous.getTime());
  return Math.min(100, Math.max(0, Math.round(elapsed * 100)));
};

/** HP and AP are re-rolled inside their configured range on every visit. */
export const rollStat = ({ min, max }: StatRange): number =>
  min + Math.floor(Math.random() * (max - min + 1));

const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export const formatDistanceToNowStrict = (isoDate?: string) => {
  if (!isoDate) return 'n/a';
  const target = new Date(isoDate).getTime();
  const diff = target - Date.now();

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];

  for (const [unit, value] of units) {
    if (Math.abs(diff) >= value || unit === 'minute') {
      const delta = Math.round(diff / value);
      return formatter.format(delta, unit);
    }
  }

  return 'just now';
};

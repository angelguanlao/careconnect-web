import {
  initials,
  firstName,
  greeting,
  todayLong,
  NAV_ITEMS,
  healthMetrics,
  appointments,
  features,
  notifications,
  BLOOD_GROUPS,
  ALLERGEN_OPTIONS,
  defaultUser,
  badgeMeta,
} from '../data/mockData.js';

describe('initials()', () => {
  it('returns two uppercase initials for a full name', () => {
    expect(initials('Sarah Chen')).toBe('SC');
  });
  it('returns one initial for a single name', () => {
    expect(initials('Jordan')).toBe('J');
  });
  it('returns ? for empty string', () => {
    expect(initials('')).toBe('?');
  });
  it('handles extra whitespace', () => {
    expect(initials('  Alice   Bob  ')).toBe('AB');
  });
});

describe('firstName()', () => {
  it('returns the first word of a full name', () => {
    expect(firstName('Sarah Chen')).toBe('Sarah');
  });
  it('returns the name unchanged when it is a single word', () => {
    expect(firstName('Jordan')).toBe('Jordan');
  });
  it('returns empty string for empty input', () => {
    expect(firstName('')).toBe('');
  });
});

describe('greeting()', () => {
  it('returns Good morning before noon', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T08:00:00'));
    expect(greeting()).toBe('Good morning');
    jest.useRealTimers();
  });
  it('returns Good afternoon between noon and 18:00', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T14:00:00'));
    expect(greeting()).toBe('Good afternoon');
    jest.useRealTimers();
  });
  it('returns Good evening at 18:00+', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T20:00:00'));
    expect(greeting()).toBe('Good evening');
    jest.useRealTimers();
  });
});

describe('todayLong()', () => {
  it('returns a non-empty formatted date string', () => {
    const result = todayLong();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
  it('returns an uppercase string', () => {
    expect(todayLong()).toBe(todayLong().toUpperCase());
  });
});

describe('static data exports', () => {
  it('NAV_ITEMS has 5 items', () => expect(NAV_ITEMS).toHaveLength(5));
  it('healthMetrics has 3 entries', () => expect(healthMetrics).toHaveLength(3));
  it('appointments has 2 entries', () => expect(appointments).toHaveLength(2));
  it('features has 6 entries', () => expect(features).toHaveLength(6));
  it('notifications has 5 entries', () => expect(notifications).toHaveLength(5));
  it('BLOOD_GROUPS includes O+', () => expect(BLOOD_GROUPS).toContain('O+'));
  it('ALLERGEN_OPTIONS includes Penicillin', () => expect(ALLERGEN_OPTIONS).toContain('Penicillin'));
  it('defaultUser has a name', () => expect(defaultUser.name).toBeTruthy());
  it('badgeMeta returns icon for known status', () => {
    expect(badgeMeta('success').icon).toBe('check');
    expect(badgeMeta('error').icon).toBe('error');
    expect(badgeMeta('info').icon).toBe('info');
    expect(badgeMeta('unknown').icon).toBe('info'); // falls back
  });
});

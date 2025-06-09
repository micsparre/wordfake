// Test utilities for simulating different dates
const TEST_DATE_KEY = 'wordfake.testDate.v1';

export function getTestDate(): Date | null {
  try {
    const stored = localStorage.getItem(TEST_DATE_KEY);
    if (!stored) return null;
    return new Date(stored);
  } catch (error) {
    console.error('Failed to load test date:', error);
    return null;
  }
}

export function setTestDate(date: Date): void {
  try {
    localStorage.setItem(TEST_DATE_KEY, date.toISOString());
  } catch (error) {
    console.error('Failed to save test date:', error);
  }
}

export function clearTestDate(): void {
  try {
    localStorage.removeItem(TEST_DATE_KEY);
  } catch (error) {
    console.error('Failed to clear test date:', error);
  }
}

export function getCurrentGameDate(): Date {
  const testDate = getTestDate();
  if (testDate) {
    console.log('Using test date:', testDate.toDateString());
    return testDate;
  }
  return new Date();
}

export function skipToNextDay(): Date {
  const currentDate = getCurrentGameDate();
  console.log('currentDate', currentDate.toDateString());
  const nextDay = new Date(currentDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0); // Start of day
  setTestDate(nextDay);
  return nextDay;
}

export function setTestTime(hour: number, minute: number = 0): Date {
  const currentDate = getCurrentGameDate();
  const newDate = new Date(currentDate);
  newDate.setHours(hour, minute, 0, 0);
  setTestDate(newDate);
  return newDate;
}

export function setTimeToBeforeMidnight(): Date {
  const currentDate = getCurrentGameDate();
  const beforeMidnight = new Date(currentDate);
  beforeMidnight.setHours(23, 59, 30, 0); // 11:59:30 PM
  setTestDate(beforeMidnight);
  return beforeMidnight;
}

export function setTimeToAfterMidnight(): Date {
  const currentDate = getCurrentGameDate();
  const afterMidnight = new Date(currentDate);
  afterMidnight.setDate(afterMidnight.getDate() + 1);
  afterMidnight.setHours(0, 0, 30, 0); // 12:00:30 AM next day
  setTestDate(afterMidnight);
  return afterMidnight;
}

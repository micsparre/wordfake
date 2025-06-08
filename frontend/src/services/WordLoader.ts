import realWordsRaw from '../assets/real.txt?raw';
import fakeWordsRaw from '../assets/fake.txt?raw';

export function loadRealWords(): string[] {
  try {
    return realWordsRaw
      .trim()
      .split('\n')
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0);
  } catch (error) {
    console.error('Failed to load real words:', error);
    return [];
  }
}

export function loadFakeWords(): string[] {
  try {
    return fakeWordsRaw
      .trim()
      .split('\n')
      .map((word) => word.trim().toUpperCase())
      .filter((word) => word.length > 0);
  } catch (error) {
    console.error('Failed to load fake words:', error);
    return [];
  }
}

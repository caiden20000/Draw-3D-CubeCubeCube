export { r, r_li, clamp };

// Returns random int in range [min, max] inclusive
function r(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

// Returns random element from the list
function r_li<T>(list: T[]): T {
  return list[r(0, list.length - 1)];
}

function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

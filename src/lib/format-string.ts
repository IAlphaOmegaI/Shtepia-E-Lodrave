export function formatString(count: number, string: string) {
  if (count === 1) {
    return `${count} ${string}`;
  }
  return `${count} ${string}s`;
}
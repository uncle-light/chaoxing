export async function sleep(ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}
export function generateRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

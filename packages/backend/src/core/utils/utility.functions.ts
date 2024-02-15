export const chunkArray = <T>(array: T[], size: number): T[][] => {
  if (array.length <= size) {
    return [array]
  }

  return [array.slice(0, size), ...chunkArray(array.slice(size), size)]
}

import { describe, expect, it } from "vitest"

import { chunkArray } from "./utility.functions"

describe("test chunkArray method", () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  it("returns one chunk if size is higher than length", () => {
    const size = 20 // > length
    const chunks = chunkArray(input, size)

    expect(chunks.length).toBe(1)
    expect(chunks[0]).toEqual(input)
  })

  it("returns one chunks if size is equal to length", () => {
    const size = 10 // = length
    const chunks = chunkArray(input, size)

    expect(chunks.length).toBe(1)
    expect(chunks[0]).toEqual(input)
  })

  it("returns multiple chunks if size is lower than length and length % size === 0", () => {
    const size = 2 // < length
    const chunks = chunkArray(input, size)

    expect(chunks.length).toBe(5)
  })

  it("returns incomplete chunks if length % size !== 0", () => {
    const size = 3 // < length
    const chunks = chunkArray(input, size)

    expect(chunks.length).toBe(4)
  })
})

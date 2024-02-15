type KeysOfType<T, TCondition> = {
  [Key in keyof T]: T[Key] extends TCondition ? Key : never
}[keyof T]

export type ArrayKey<T> = KeysOfType<T, unknown[]>

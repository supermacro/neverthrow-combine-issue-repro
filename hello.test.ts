import td from 'testdouble'
import { combine, ResultAsync, ok, okAsync } from 'neverthrow'

interface ITestInterface {
    getName(): string
    setName(name: string): void
    getAsyncResult(): ResultAsync<ITestInterface, Error>
}

describe("Debugging and basic info tests", () => {
  it("Correctly combines a list of objects", () => {
    const result = combine([
      ok({ name: 'giorgio' }),
      ok({ age: 123 }),
      ok({ color: 'red' })
    ] as const)


    expect(
      result._unsafeUnwrap()
    ).toEqual([
      { name: 'giorgio' },
      { age: 123 },
      { color: 'red' },
    ])
  })

  it('Correctly combines a list of proxies', () => {
    const result = combine([
      ok(new Proxy({}, {})),
      ok(new Proxy({}, {})),
      ok(new Proxy({}, {})),
    ] as const)

    expect(
      result._unsafeUnwrap().length
    ).toBe(3)
  })

  it("combine works with TestDouble mocks of interfaces", async () => {
    // Arrange
    const mock = td.object<ITestInterface>()

    // Act
    const result = await combine([
      okAsync(mock),
      okAsync({ name: 'giorgio' }),
      okAsync(123),
    ] as const)

    // Assert
    expect(result).toBeDefined()
    expect(result.isErr()).toBeFalsy()
    const unwrappedResult = result._unsafeUnwrap()


    expect(unwrappedResult.length).toBe(3)
    expect(unwrappedResult[0]).toBe(mock)
  })
})

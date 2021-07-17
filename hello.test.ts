import td from 'testdouble'
import { combine, ResultAsync, okAsync } from 'neverthrow'

interface ITestInterface {
    getName(): string
    setName(name: string): void
    getAsyncResult(): ResultAsync<ITestInterface, Error>
}

describe("Debugging and basic info tests", () => {
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

    expect(unwrappedResult.length).toBe(2)
    expect(unwrappedResult[0]).toBe(mock)
  })
})

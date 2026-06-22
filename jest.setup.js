// Silence internal framework logs during tests
jest.spyOn(console, 'log').mockImplementation(() => {})

const throwError = (errorString: string): void => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error(errorString)
    } else {
        // eslint-disable-next-line no-console
        console.error(`${errorString}.\n\n⚠ This would throw an error on production`)
    }
}

export default throwError

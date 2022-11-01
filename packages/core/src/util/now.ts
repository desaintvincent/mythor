const perf = performance ?? Date
const now = perf.now.bind(perf)

export default now

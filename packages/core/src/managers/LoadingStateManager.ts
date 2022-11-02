import Manager from '../ecs/Manager'

export interface LoadingState {
  name: string
  current: number
  total: number
  weight: number
  detail: string
}

class LoadingStateManager extends Manager {
  private readonly loadingStates: Map<string, LoadingState>

  public constructor () {
    super('LoadingStateManager')
    this.loadingStates = new Map<string, LoadingState>()
  }

  public createState (state: Partial<LoadingState> & {name: string}): LoadingState {
    const newState: LoadingState = {
      current: state.current ?? 0,
      detail: state.detail ?? '',
      name: state.name,
      total: state.total ?? 100,
      weight: state.weight ?? 1,
    }

    this.loadingStates.set(state.name, newState)

    return newState
  }

  public getState (stateName: string): LoadingState | undefined {
    return this.loadingStates.get(stateName)
  }

  public getLoadingPercentage (): number {
    const values = Array.from(this.loadingStates.values())

    const [total, totalWeight] = values.reduce(([accTotal, accTotalWeight]: [number, number], state: LoadingState): [number, number] => {
      const percentage = state.current / state.total

      return [accTotal + percentage * state.weight, accTotalWeight + state.weight]
    }, [0, 0])

    return total * 100 / (totalWeight || 1)
  }

  public getLoadingDetail (): string {
    const states = Array.from(this.loadingStates.values())
    for (const state of states) {
      if (state.current < state.total) {
        return state.detail
      }
    }

    return ''
  }
}

export default LoadingStateManager

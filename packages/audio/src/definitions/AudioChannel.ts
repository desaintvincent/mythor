/**
 * Channel a sound is routed through. Modeled as a plain `string` (like
 * `AssetManifestEntry.type` in `@mythor/assets`) instead of a closed enum, so
 * consumers can register/use their own channel names without needing changes
 * in this package. `AudioChannels` only lists the defaults `AudioManager`
 * assumes callers will commonly want.
 */
export type AudioChannel = string

export const AudioChannels = {
  Music: 'music',
  Sfx: 'sfx',
  Ui: 'ui',
} as const

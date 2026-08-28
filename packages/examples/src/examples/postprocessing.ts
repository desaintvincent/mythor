import { createGame } from '@mythor/game'
import { Manager } from '@mythor/core'
import type { Ecs } from '@mythor/core'
import {
  Renderer,
  PostProcessEffect,
  GrayscaleEffect,
  VignetteEffect,
  ChromaticAberrationEffect,
  BlurEffect,
} from '@mythor/renderer'
import { Vec2 } from '@mythor/math'
import { EventsManager, Key } from '@mythor/events'

// A custom postprocessing effect can be built outside the library by
// extending `PostProcessEffect`: pass a fragment shader to `super()`,
// resolve any extra uniform locations in `onInit()`, and push their
// current values in `setUniforms()`. That's the whole contract.
const pixelateFragmentShader = `#version 300 es
precision highp float;

in vec2 v_uv;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_pixelSize;

out vec4 outColor;

void main() {
    vec2 pixels = u_resolution / u_pixelSize;
    vec2 uv = floor(v_uv * pixels) / pixels;

    outColor = texture(u_texture, uv);
}
`

class PixelateEffect extends PostProcessEffect {
  public pixelSize: number
  private pixelSizeUniform!: WebGLUniformLocation

  public constructor(options?: { pixelSize?: number }) {
    super(pixelateFragmentShader)
    this.pixelSize = options?.pixelSize ?? 8
  }

  protected onInit(): void {
    this.pixelSizeUniform = this.getUniformLocation('u_pixelSize')
  }

  protected setUniforms(): void {
    this.gl.uniform1f(this.pixelSizeUniform, this.pixelSize)
  }
}

const grayscale = new GrayscaleEffect({ intensity: 1 })
const vignette = new VignetteEffect({ radius: 0.4, softness: 0.6 })
const chromaticAberration = new ChromaticAberrationEffect({ strength: 0.015 })
const blur = new BlurEffect({ strength: 1.5 })
const pixelate = new PixelateEffect({ pixelSize: 6 })

grayscale.enabled = false
vignette.enabled = true
chromaticAberration.enabled = false
blur.enabled = false
pixelate.enabled = false

class ScenePainter extends Manager {
  public constructor() {
    super('ScenePainter')
  }

  public update(ecs: Ecs, elapsedTimeInSeconds: number): void {
    this.ecs.system(Renderer).onDraw((renderer) => {
      const columns = 8
      const rows = 5
      const spacingX = 90
      const spacingY = 80

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const x = (column - (columns - 1) / 2) * spacingX
          const y = (row - (rows - 1) / 2) * spacingY
          const hue = (column / columns + row / rows) / 2
          const color: [number, number, number, number] = [
            0.5 + 0.5 * Math.sin(hue * 6.28),
            0.5 + 0.5 * Math.sin(hue * 6.28 + 2.09),
            0.5 + 0.5 * Math.sin(hue * 6.28 + 4.19),
            1,
          ]

          if ((row + column) % 3 === 0) {
            renderer.fillCircle(new Vec2(x, y), new Vec2(28, 28), { color })
          } else if ((row + column) % 3 === 1) {
            renderer.fillRect(new Vec2(x, y), new Vec2(44, 44), {
              color,
              rotation: this.rotation + row + column,
            })
          } else {
            renderer.fillPoly(
              new Vec2(x, y),
              [new Vec2(0, -26), new Vec2(24, 18), new Vec2(-24, 18)],
              { color }
            )
          }
        }
      }
    })

    this.rotation += elapsedTimeInSeconds
  }

  private rotation = 0
}

class PostProcessingControls extends Manager {
  public constructor() {
    super('PostProcessingControls')
  }

  public update(): void {
    const events = this.ecs.manager(EventsManager)

    if (events.keyPressed(Key.Digit1)) {
      grayscale.enabled = !grayscale.enabled
    }
    if (events.keyPressed(Key.Digit2)) {
      vignette.enabled = !vignette.enabled
    }
    if (events.keyPressed(Key.Digit3)) {
      chromaticAberration.enabled = !chromaticAberration.enabled
    }
    if (events.keyPressed(Key.Digit4)) {
      blur.enabled = !blur.enabled
    }
    if (events.keyPressed(Key.Digit5)) {
      pixelate.enabled = !pixelate.enabled
    }

    this.ecs.system(Renderer).onDraw((renderer) => {
      const line = (
        index: number,
        key: string,
        label: string,
        effect: { enabled: boolean }
      ): void => {
        renderer.text(
          new Vec2(-500, -230 + index * 24),
          `[${key}] ${label}: ${effect.enabled ? 'ON' : 'off'}`,
          { color: effect.enabled ? [0, 1, 0, 1] : [1, 1, 1, 1] }
        )
      }

      line(1, '1', 'grayscale', grayscale)
      line(2, '2', 'vignette', vignette)
      line(3, '3', 'chromatic aberration', chromaticAberration)
      line(4, '4', 'blur', blur)
      line(5, '5', 'pixelate (custom)', pixelate)
    })
  }
}

createGame({
  managers: [
    new EventsManager(),
    new ScenePainter(),
    new PostProcessingControls(),
  ],
  systems: [
    new Renderer({
      postProcessing: [
        grayscale,
        vignette,
        chromaticAberration,
        blur,
        pixelate,
      ],
    }),
  ],
})

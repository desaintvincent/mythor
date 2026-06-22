import Animation from '../src/components/Animation'

describe('Animation', () => {
  describe('constructor', () => {
    it('defaults: currentFrame=0, time=0, finished=true, no current animation', () => {
      const anim = new Animation(0.1)
      expect(anim.currentFrame).toBe(0)
      expect(anim.time).toBe(0)
      expect(anim.finished).toBe(true)
      expect(anim.currentAnimation).toBeNull()
      expect(anim.previousAnimation).toBeNull()
      expect(anim.animations.size).toBe(0)
    })

    it('stores animationSpeed', () => {
      const anim = new Animation(0.2)
      expect(anim.animationSpeed).toBe(0.2)
    })
  })

  describe('add', () => {
    it('adds animation to map', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      expect(anim.animations.has('walk')).toBe(true)
    })

    it('first add auto-runs the animation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      expect(anim.currentAnimation).toBe('walk')
      expect(anim.currentFrame).toBe(0)
      expect(anim.finished).toBe(false)
    })

    it('second add does not override current animation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.add('run', 9, 15)
      expect(anim.currentAnimation).toBe('walk')
    })

    it('default params: loop=true, speed=0, fallBack=null', () => {
      const anim = new Animation()
      anim.add('idle', 0, 3)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const def = anim.animations.get('idle')!
      expect(def.loop).toBe(true)
      expect(def.speed).toBe(0)
      expect(def.fallBack).toBeNull()
    })

    it('custom params are stored', () => {
      const anim = new Animation()
      anim.add('jump', 4, 7, { loop: false, speed: 0.05, fallBack: 'idle' })
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const def = anim.animations.get('jump')!
      expect(def.loop).toBe(false)
      expect(def.speed).toBe(0.05)
      expect(def.fallBack).toBe('idle')
    })

    it('returns Animation for chaining', () => {
      const anim = new Animation()
      const result = anim.add('idle', 0, 3)
      expect(result).toBe(anim)
    })
  })

  describe('run', () => {
    it('switches current animation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.add('run', 9, 15)
      anim.run('run')
      expect(anim.currentAnimation).toBe('run')
    })

    it('sets currentFrame to animation start', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.add('run', 9, 15)
      anim.run('run')
      expect(anim.currentFrame).toBe(9)
    })

    it('sets previousAnimation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.add('run', 9, 15)
      anim.run('run')
      expect(anim.previousAnimation).toBe('walk')
    })

    it('resets time and finished', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.time = 99
      anim.finished = true
      anim.add('run', 9, 15)
      anim.run('run')
      expect(anim.time).toBe(0)
      expect(anim.finished).toBe(false)
    })

    it('running same animation without reset is a no-op', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.currentFrame = 5
      anim.run('walk')
      expect(anim.currentFrame).toBe(5)
    })

    it('run with reset=true restarts even same animation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.currentFrame = 5
      anim.run('walk', true)
      expect(anim.currentFrame).toBe(0)
    })

    it('run unknown animation is a no-op', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.run('ghost')
      expect(anim.currentAnimation).toBe('walk')
    })

    it('returns Animation for chaining', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      expect(anim.run('walk', true)).toBe(anim)
    })
  })

  describe('running', () => {
    it('returns true when named animation is active', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      expect(anim.running('walk')).toBe(true)
    })

    it('returns false for non-active animation', () => {
      const anim = new Animation()
      anim.add('walk', 0, 8)
      anim.add('run', 9, 15)
      expect(anim.running('run')).toBe(false)
    })
  })

  describe('numeric animation ids', () => {
    it('supports numeric ids', () => {
      const anim = new Animation<number>()
      anim.add(0, 0, 4)
      anim.add(1, 5, 9)
      anim.run(1)
      expect(anim.currentAnimation).toBe(1)
      expect(anim.running(1)).toBe(true)
      expect(anim.running(0)).toBe(false)
    })
  })
})

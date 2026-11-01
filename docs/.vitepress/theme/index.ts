import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

function updateProgress() {
  const bar = document.querySelector('.ms-progress') as HTMLElement | null
  if (!bar) return
  const doc = document.documentElement
  const scrollTop = doc.scrollTop || document.body.scrollTop
  const height = doc.scrollHeight - doc.clientHeight
  const ratio = height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0
  bar.style.width = `${ratio}%`
}

function ensureProgressBar() {
  if (document.querySelector('.ms-progress')) return
  const el = document.createElement('div')
  el.className = 'ms-progress'
  el.setAttribute('aria-hidden', 'true')
  document.body.appendChild(el)
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
}

type ParallaxCleanup = () => void

let parallaxCleanup: ParallaxCleanup | null = null

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isHomePath(path: string) {
  const clean = (path || '/')
    .replace(/index\.html$/i, '')
    .replace(/\/+$/, '') || '/'
  return clean === '/' || /\/MedSynapse-Research-group-study-materials$/i.test(clean)
}

function ensureParallaxLayers(home: HTMLElement) {
  if (home.querySelector('.ms-parallax')) return
  const root = document.createElement('div')
  root.className = 'ms-parallax'
  root.setAttribute('aria-hidden', 'true')
  root.innerHTML = `
    <div class="ms-parallax__layer ms-parallax__layer--far" data-depth="0.12"></div>
    <div class="ms-parallax__layer ms-parallax__layer--mid" data-depth="0.28"></div>
    <div class="ms-parallax__layer ms-parallax__layer--near" data-depth="0.48"></div>
    <div class="ms-parallax__grain" data-depth="0.08"></div>
  `
  home.prepend(root)
}

function markHomeParallaxTargets(home: HTMLElement) {
  const heroName = home.querySelector('.VPHero .name') as HTMLElement | null
  const heroText = home.querySelector('.VPHero .text') as HTMLElement | null
  const heroTag = home.querySelector('.VPHero .tagline') as HTMLElement | null
  const heroActions = home.querySelector('.VPHero .actions') as HTMLElement | null
  const features = home.querySelectorAll('.VPFeature')
  const panels = home.querySelectorAll('.ms-panel')
  const steps = home.querySelectorAll('.ms-step')

  heroName?.setAttribute('data-ms-parallax', '0.18')
  heroText?.setAttribute('data-ms-parallax', '0.28')
  heroTag?.setAttribute('data-ms-parallax', '0.36')
  heroActions?.setAttribute('data-ms-parallax', '0.42')

  features.forEach((el, i) => {
    el.setAttribute('data-ms-parallax', String(0.14 + (i % 3) * 0.06))
    el.setAttribute('data-ms-parallax-x', String(((i % 2) * 2 - 1) * 0.04))
  })
  panels.forEach((el, i) => {
    el.setAttribute('data-ms-parallax', String(0.1 + i * 0.05))
  })
  steps.forEach((el, i) => {
    el.setAttribute('data-ms-parallax', String(0.16 + i * 0.05))
    el.setAttribute('data-ms-parallax-x', String((i - 1) * 0.05))
  })
}

function initHomeParallax(): ParallaxCleanup | null {
  destroyHomeParallax()

  const home = document.querySelector('.VPHome') as HTMLElement | null
  if (!home || prefersReducedMotion()) return null

  home.classList.add('ms-home--parallax')
  ensureParallaxLayers(home)
  markHomeParallaxTargets(home)

  let pointerX = 0
  let pointerY = 0
  let targetX = 0
  let targetY = 0
  let raf = 0
  let running = true

  const doc = document.documentElement

  const apply = () => {
    if (!running) return
    const scrollY = doc.scrollTop || document.body.scrollTop || 0
    pointerX += (targetX - pointerX) * 0.08
    pointerY += (targetY - pointerY) * 0.08

    doc.style.setProperty('--ms-scroll', `${scrollY}`)
    doc.style.setProperty('--ms-px', pointerX.toFixed(4))
    doc.style.setProperty('--ms-py', pointerY.toFixed(4))

    home.querySelectorAll<HTMLElement>('[data-depth]').forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0)
      const y = scrollY * depth * -0.35
      const x = pointerX * depth * 28
      const py = pointerY * depth * 18
      layer.style.transform = `translate3d(${x}px, ${y + py}px, 0) scale(${1 + depth * 0.08})`
    })

    home.querySelectorAll<HTMLElement>('[data-ms-parallax]').forEach((el) => {
      const depth = Number(el.dataset.msParallax || 0)
      const xDepth = Number(el.dataset.msParallaxX || 0)
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight || 1
      const centerOffset = (rect.top + rect.height / 2 - viewH / 2) / viewH
      const y = centerOffset * depth * -48
      const x = pointerX * (0.12 + Math.abs(xDepth)) * 22 + xDepth * scrollY * 0.02
      const tilt = pointerX * depth * 1.2
      el.style.setProperty('--ms-tx', `${x.toFixed(2)}px`)
      el.style.setProperty('--ms-ty', `${y.toFixed(2)}px`)
      el.style.setProperty('--ms-rot', `${tilt.toFixed(3)}deg`)
    })

    raf = requestAnimationFrame(apply)
  }

  const onPointer = (e: PointerEvent) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    targetX = Math.max(-1, Math.min(1, (e.clientX - cx) / cx))
    targetY = Math.max(-1, Math.min(1, (e.clientY - cy) / cy))
  }

  const onLeave = () => {
    targetX = 0
    targetY = 0
  }

  window.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('pointerleave', onLeave, { passive: true })
  raf = requestAnimationFrame(apply)

  return () => {
    running = false
    cancelAnimationFrame(raf)
    window.removeEventListener('pointermove', onPointer)
    window.removeEventListener('pointerleave', onLeave)
    home.classList.remove('ms-home--parallax')
    home.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
      el.style.transform = ''
    })
    home.querySelectorAll<HTMLElement>('[data-ms-parallax]').forEach((el) => {
      el.style.removeProperty('--ms-tx')
      el.style.removeProperty('--ms-ty')
      el.style.removeProperty('--ms-rot')
    })
    doc.style.removeProperty('--ms-scroll')
    doc.style.removeProperty('--ms-px')
    doc.style.removeProperty('--ms-py')
  }
}

function destroyHomeParallax() {
  if (parallaxCleanup) {
    parallaxCleanup()
    parallaxCleanup = null
  }
}

function syncHomeParallax(path: string) {
  destroyHomeParallax()
  if (!isHomePath(path)) return
  nextTick(() => {
    // Wait one frame so VitePress home DOM is ready
    requestAnimationFrame(() => {
      parallaxCleanup = initHomeParallax()
    })
  })
}

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()
    onMounted(() => {
      ensureProgressBar()
      nextTick(updateProgress)
      syncHomeParallax(route.path)
    })
    watch(
      () => route.path,
      (path) =>
        nextTick(() => {
          ensureProgressBar()
          updateProgress()
          window.scrollTo(0, 0)
          syncHomeParallax(path)
        })
    )
    onUnmounted(() => {
      destroyHomeParallax()
    })
  }
}

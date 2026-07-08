'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { isMobile, allowHeavy3D } from '@/lib/constants'

interface Range3D {
  x: number
  y: number
  z: number
}

function createSpriteTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,245,225,1)')
  grad.addColorStop(1, 'rgba(255,245,225,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
}

function createBeamTexture(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  const grad = ctx.createLinearGradient(0, 0, 0, 512)
  grad.addColorStop(0, 'rgba(255,240,210,0)')
  grad.addColorStop(0.5, 'rgba(255,214,150,0.85)')
  grad.addColorStop(1, 'rgba(255,240,210,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 512)
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const fallbackRef = useRef<HTMLDivElement>(null)
  const lightsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const fallback = fallbackRef.current
    const liveLights = lightsRef.current
    if (!wrap) return

    if (isMobile) {
      if (fallback) fallback.classList.add('visible')
      return
    }

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      if (fallback) fallback.classList.add('visible')
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      1200
    )
    camera.position.set(0, 0.5, 24)

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, allowHeavy3D ? 2 : 1.5)
    )
    renderer.setSize(wrap.clientWidth, wrap.clientHeight)
    wrap.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xfce4c2, 0.55)
    const key = new THREE.PointLight(0xdca965, 1.35, 220)
    key.position.set(11, 7, 18)
    const fill = new THREE.PointLight(0x5675a1, 1.1, 220)
    fill.position.set(-12, -8, 14)
    const rim = new THREE.PointLight(0xffe2b2, 0.9, 180)
    rim.position.set(0, 12, -8)
    scene.add(ambient, key, fill, rim)

    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = 128
    spriteCanvas.height = 128
    const spriteCtx = spriteCanvas.getContext('2d')!
    createSpriteTexture(spriteCtx, spriteCanvas)
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas)

    function createParticleLayer(
      count: number,
      range: Range3D,
      size: number,
      color: number,
      depthShift: number
    ): THREE.Points {
      const geom = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * range.x
        positions[i * 3 + 1] = (Math.random() - 0.5) * range.y
        positions[i * 3 + 2] = (Math.random() - 0.5) * range.z + depthShift
      }
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const mat = new THREE.PointsMaterial({
        map: spriteTexture,
        color,
        transparent: true,
        opacity: 0.72,
        size,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      return new THREE.Points(geom, mat)
    }

    const backDust = createParticleLayer(
      isMobile ? 180 : 420,
      { x: 70, y: 36, z: 70 },
      isMobile ? 0.34 : 0.4,
      0x8fb7e6,
      -12
    )
    const midDust = createParticleLayer(
      isMobile ? 120 : 280,
      { x: 50, y: 26, z: 50 },
      isMobile ? 0.44 : 0.55,
      0xe3c08d,
      2
    )
    const frontDust = createParticleLayer(
      isMobile ? 90 : 180,
      { x: 34, y: 20, z: 30 },
      isMobile ? 0.55 : 0.72,
      0xfff0d2,
      8
    )
    scene.add(backDust, midDust, frontDust)

    const haloGroup = new THREE.Group()
    const ringMaterialA = new THREE.MeshStandardMaterial({
      color: 0xb17e44,
      metalness: 0.82,
      roughness: 0.22,
      transparent: true,
      opacity: 0.22,
    })
    const ringMaterialB = new THREE.MeshStandardMaterial({
      color: 0x6e8fb9,
      metalness: 0.8,
      roughness: 0.24,
      transparent: true,
      opacity: 0.18,
    })
    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.28, 24, 180),
      ringMaterialA
    )
    ringA.rotation.x = Math.PI / 2.85
    ringA.rotation.y = Math.PI / 7
    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(9.2, 0.16, 20, 180),
      ringMaterialB
    )
    ringB.rotation.x = Math.PI / 2.55
    ringB.rotation.y = -Math.PI / 6
    haloGroup.add(ringA, ringB)
    scene.add(haloGroup)

    const wavePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(44, 25, 70, 42),
      new THREE.MeshStandardMaterial({
        color: 0x1b2432,
        roughness: 0.88,
        metalness: 0.28,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      })
    )
    wavePlane.position.z = -13
    scene.add(wavePlane)

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 20),
      new THREE.MeshBasicMaterial({
        color: 0xf1c67b,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
      })
    )
    glowPlane.position.z = -6
    scene.add(glowPlane)

    const bloomCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.1, allowHeavy3D ? 2 : 1),
      new THREE.MeshPhysicalMaterial({
        color: 0xf1ce97,
        metalness: 0.35,
        roughness: 0.08,
        transmission: 0.95,
        transparent: true,
        opacity: 0.02,
        thickness: 1.4,
      })
    )
    bloomCore.position.set(0, 0.5, -9)
    scene.add(bloomCore)

    const prismGroup = new THREE.Group()
    const prismGeom = new THREE.OctahedronGeometry(allowHeavy3D ? 0.44 : 0.36, 0)
    const prismCount = allowHeavy3D ? 22 : 10
    for (let i = 0; i < prismCount; i++) {
      const prism = new THREE.Mesh(
        prismGeom,
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xc89d66 : 0x7f9fc6,
          transparent: true,
          opacity: 0.22,
          metalness: 0.72,
          roughness: 0.22,
        })
      )
      const radius = 6.4 + Math.random() * 5.2
      const angle = Math.random() * Math.PI * 2
      prism.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 6.5,
        -4 + Math.sin(angle) * 4.8
      )
      prism.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      prismGroup.add(prism)
    }
    scene.add(prismGroup)

    const beamCanvas = document.createElement('canvas')
    beamCanvas.width = 32
    beamCanvas.height = 512
    const beamCtx = beamCanvas.getContext('2d')!
    createBeamTexture(beamCtx, beamCanvas)
    const beamTexture = new THREE.CanvasTexture(beamCanvas)

    const lightShaftGroup = new THREE.Group()
    const shaftCount = allowHeavy3D ? 6 : 3
    for (let i = 0; i < shaftCount; i++) {
      const shaft = new THREE.Mesh(
        new THREE.PlaneGeometry(allowHeavy3D ? 2.1 : 1.4, allowHeavy3D ? 20 : 14),
        new THREE.MeshBasicMaterial({
          map: beamTexture,
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      )
      shaft.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 8, -7 - Math.random() * 3)
      shaft.rotation.z = (Math.random() - 0.5) * 0.8
      lightShaftGroup.add(shaft)
    }
    scene.add(lightShaftGroup)

    let pointerX = 0
    let pointerY = 0

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2
      if (liveLights) {
        const lx1 = 20 + pointerX * 10
        const ly1 = 30 + pointerY * 8
        const lx2 = 80 - pointerX * 9
        const ly2 = 62 - pointerY * 7
        liveLights.style.setProperty('--glow-x1', `${lx1}%`)
        liveLights.style.setProperty('--glow-y1', `${ly1}%`)
        liveLights.style.setProperty('--glow-x2', `${lx2}%`)
        liveLights.style.setProperty('--glow-y2', `${ly2}%`)
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    function waveMesh(mesh: THREE.Mesh, t: number, amp: number, freq: number) {
      const pos = mesh.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        const y = pos.getY(i)
        const z =
          Math.sin(x * freq + t) * amp +
          Math.cos(y * (freq * 0.85) + t * 1.2) * amp * 0.7
        pos.setZ(i, z)
      }
      pos.needsUpdate = true
      mesh.geometry.computeVertexNormals()
    }

    function driftParticles(points: THREE.Points, t: number, speed: number, sway: number) {
      const attr = points.geometry.attributes.position
      for (let i = 0; i < attr.count; i++) {
        const x = attr.getX(i)
        const y = attr.getY(i)
        const z = attr.getZ(i)
        attr.setX(i, x + Math.sin(t * speed + i * 0.11) * sway)
        attr.setY(i, y + Math.cos(t * speed * 0.85 + i * 0.09) * sway)
        attr.setZ(i, z + Math.sin(t * speed * 1.1 + i * 0.07) * sway * 0.8)
      }
      attr.needsUpdate = true
    }

    let animFrame = 0
    let destroyed = false
    function animate() {
      if (destroyed) return
      const t = performance.now() * 0.00018

      backDust.rotation.y += 0.00035
      midDust.rotation.y -= 0.00045
      frontDust.rotation.y += 0.0007

      driftParticles(backDust, t, 1.7, 0.0022)
      driftParticles(midDust, t, 2.4, 0.0031)
      driftParticles(frontDust, t, 2.9, 0.0035)

      haloGroup.rotation.z = Math.sin(t * 1.8) * 0.15
      haloGroup.rotation.x = Math.sin(t * 1.3) * 0.07
      ringA.rotation.z += 0.0014
      ringB.rotation.z -= 0.0009

      waveMesh(wavePlane, t * 8, 0.18, 0.5)

      ;(glowPlane.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 6.2) * 0.015
      bloomCore.rotation.x += 0.0022
      bloomCore.rotation.y -= 0.0028
      bloomCore.position.y = 0.5 + Math.sin(t * 7.5) * 0.2
      ;(bloomCore.material as THREE.MeshPhysicalMaterial).opacity =
        0.02 + Math.sin(t * 8.2) * 0.015

      prismGroup.rotation.y += 0.0014
      prismGroup.rotation.x = Math.sin(t * 2.3) * 0.09
      prismGroup.children.forEach((child, idx) => {
        const prism = child as THREE.Mesh
        prism.rotation.x += 0.002 + (idx % 4) * 0.0005
        prism.rotation.y -= 0.0025 + (idx % 3) * 0.0004
      })

      lightShaftGroup.rotation.z = Math.sin(t * 2) * 0.16
      lightShaftGroup.children.forEach((child, idx) => {
        const shaft = child as THREE.Mesh
        ;(shaft.material as THREE.MeshBasicMaterial).opacity =
          0.05 + (Math.sin(t * (5 + idx * 0.4)) + 1) * 0.024
      })

      const orbitX = Math.sin(t * 1.5) * 0.9
      const orbitY = Math.cos(t * 1.3) * 0.4
      camera.position.x +=
        (pointerX * 2.4 + orbitX - camera.position.x) * 0.022
      camera.position.y +=
        (-pointerY * 1.5 + orbitY - camera.position.y) * 0.022
      camera.position.z = 24 + Math.sin(t * 2.6) * 0.35
      camera.lookAt(0, 0, 0)

      if (renderer) {
        renderer.render(scene, camera)
      }
      animFrame = requestAnimationFrame(animate)
    }

    animate()

    const onResize = () => {
      if (!wrap.clientWidth || !wrap.clientHeight) return
      camera.aspect = wrap.clientWidth / wrap.clientHeight
      camera.updateProjectionMatrix()
      if (renderer) {
        renderer.setSize(wrap.clientWidth, wrap.clientHeight)
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      destroyed = true
      cancelAnimationFrame(animFrame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  return (
    <>
      <div ref={wrapRef} id="hero-canvas-wrap" aria-hidden="true" />
      <div ref={fallbackRef} id="hero-fallback" className="hero-fallback" aria-hidden="true" />
      <div ref={lightsRef} id="hero-live-lights" className="hero-live-lights" aria-hidden="true" />
      <div className="hero-live-haze" aria-hidden="true" />
    </>
  )
}

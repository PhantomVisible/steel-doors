import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class ThreeSceneService {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  particles!: THREE.Points;

  private animationId = 0;
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver | null = null;

  constructor(private ngZone: NgZone) {}

  /** Initialize the Three.js scene, camera, renderer, lights and particles */
  init(canvas: HTMLCanvasElement, container: HTMLElement): void {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfdfdff);
    this.scene.fog = new THREE.Fog(0xfdfdff, 8, 25);

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0.5, 5);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Lights — cool white environment
    const ambient = new THREE.AmbientLight(0xe8eaff, 0.8); // increased ambient
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0); // much stronger main light
    dirLight.position.set(5, 5, 8); // moved front-right to hit the new door position
    dirLight.castShadow = false;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xc5c7ff, 0.8);
    fillLight.position.set(-5, 2, 4); // moved front-left
    this.scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x4043f5, 1.0, 20);
    rimLight.position.set(2, 3, 3); // moved to rim light the door
    this.scene.add(rimLight);

    // Particles — upward-drifting cool-toned dust motes
    this.createParticles();

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize(canvas);
    });
    this.resizeObserver.observe(container);
  }

  /** Create the upward-drifting particle system */
  private createParticles(): void {
    const count = 200;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14; // X spread
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z spread
      sizes[i] = Math.random() * 3 + 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      color: 0x4043f5,
      size: 0.03,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  /** Animate particles upward with sine modulation */
  updateParticles(elapsed: number): void {
    if (!this.particles) return;
    const positions = this.particles.geometry.attributes['position']
      .array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      // Slow upward drift
      positions[i * 3 + 1] += 0.003 + Math.sin(elapsed + i) * 0.001;
      // Subtle horizontal sway
      positions[i * 3] += Math.sin(elapsed * 0.5 + i * 0.8) * 0.0005;

      // Reset particles that drift too high
      if (positions[i * 3 + 1] > 6) {
        positions[i * 3 + 1] = -5;
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    this.particles.geometry.attributes['position'].needsUpdate = true;
  }

  /** Kick off the render loop (outside Angular zone for performance) */
  startLoop(onFrame: (elapsed: number, delta: number) => void): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        onFrame(elapsed, delta);
        this.updateParticles(elapsed);
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  /** Stop the render loop */
  stopLoop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  /** Handle container resize */
  private onResize(canvas: HTMLCanvasElement): void {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  /** Clean up all resources */
  dispose(): void {
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    this.scene?.clear();
  }
}

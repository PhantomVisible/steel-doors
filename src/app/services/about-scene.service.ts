import { Injectable, NgZone } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class AboutSceneService {
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;

  private animationId = 0;
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver | null = null;

  constructor(private ngZone: NgZone) {}

  init(canvas: HTMLCanvasElement, container: HTMLElement): void {
    // Scene
    this.scene = new THREE.Scene();
    // Transparent background so the section's white/blue gradient shows through
    this.scene.background = null;

    // Camera
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    // Position camera to see the full door and its separated layers
    this.camera.position.set(-2, 0, 4);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true, // Allow transparent background
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(-3, 5, 5);
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xc5c7ff, 0.6);
    fillLight.position.set(5, 0, 3);
    this.scene.add(fillLight);

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => {
      this.onResize(container);
    });
    this.resizeObserver.observe(container);
  }

  startLoop(onFrame: (elapsed: number, delta: number) => void): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animationId = requestAnimationFrame(animate);
        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        onFrame(elapsed, delta);
        this.renderer.render(this.scene, this.camera);
      };
      animate();
    });
  }

  stopLoop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  private onResize(container: HTMLElement): void {
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose(): void {
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.renderer?.dispose();
    this.scene?.clear();
  }
}

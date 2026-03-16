import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { ExplodedDoorParts } from './exploded-door.service';

@Injectable({ providedIn: 'root' })
export class AnimationService {
  private gsap: any;
  private ScrollTrigger: any;
  private isBrowser: boolean;
  private mm: any; // gsap.matchMedia()

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async loadGsap(): Promise<void> {
    if (!this.isBrowser) return;
    const gsapModule = await import('gsap');
    const stModule = await import('gsap/ScrollTrigger');
    this.gsap = gsapModule.gsap || gsapModule.default;
    this.ScrollTrigger = stModule.ScrollTrigger || stModule.default;
    this.gsap.registerPlugin(this.ScrollTrigger);
    this.mm = this.gsap.matchMedia();
  }

  /** Apply sine-wave levitation with mobile optimization */
  applyLevitation(object: THREE.Object3D, elapsed: number): void {
    const isMobile = window.innerWidth < 768;
    const floatDistance = isMobile ? 0.05 : 0.15; // Reduced for mobile
    const driftDistance = isMobile ? 0.02 : 0.04;

    // Primary Y float
    object.position.y = Math.sin(elapsed * 0.8) * floatDistance;
    
    if (!isMobile) {
      // Desktop: Push the door to the right
      object.position.x = 1.2 + Math.sin(elapsed * 0.3) * 0.05;
    } else {
      // Mobile: Keep centered
      object.position.x = Math.sin(elapsed * 0.3) * 0.02;
    }
    
    // Subtle Z drift
    object.position.z = Math.cos(elapsed * 0.4) * driftDistance;
    
    // Continuous rotation
    object.rotation.y = elapsed * 0.4;
    object.rotation.x = Math.cos(elapsed * 0.25) * 0.05;
  }

  /** Entrance animations with matchMedia */
  setupEntranceAnimations(container: HTMLElement): void {
    if (!this.gsap || !this.ScrollTrigger || !this.mm) return;

    this.mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context: any) => {
      const { isMobile } = context.conditions;
      const yOffset = isMobile ? 30 : 60; // Reduced Y jump for mobile

      const elements = container.querySelectorAll('[data-animate]');
      elements.forEach((el, i) => {
        this.gsap.fromTo(
          el,
          {
            opacity: 0,
            y: yOffset,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: i * 0.08,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      return () => {
        // Cleanup if needed
      };
    });
  }

  /** Animate a 3D object's position property springing back */
  animateSpringBack(object: THREE.Object3D, targetZ: number): void {
    if (!this.gsap) return;
    this.gsap.to(object.position, {
      z: targetZ,
      duration: 1.0,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  /** Animate a 3D object swiping completely away */
  animateSwipeAway(object: THREE.Object3D, originalZ: number, dir: number): void {
    if (!this.gsap) return;
    this.gsap.to(object.position, {
      z: originalZ + dir * 5.0,
      duration: 0.6,
      ease: 'power2.inOut'
    });
  }

  /** Reset object back to its start position */
  animateReset(object: THREE.Object3D, targetZ: number): void {
    if (!this.gsap) return;
    this.gsap.to(object.position, {
      z: targetZ,
      duration: 1.0,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  refresh(): void {
    this.ScrollTrigger?.refresh();
  }

  dispose(): void {
    this.mm?.revert();
    this.ScrollTrigger?.getAll().forEach((st: any) => st.kill());
  }
}

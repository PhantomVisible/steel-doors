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

  // ============================
  // ZERO-GRAVITY LEVITATION (for Hero door)
  // ============================

  /** Apply sine-wave levitation to the Hero door model */
  applyLevitation(object: THREE.Object3D, elapsed: number): void {
    // Primary Y float
    object.position.y = Math.sin(elapsed * 0.8) * 0.15;
    
    // Center the door on mobile (0), push to the right for desktop text overlay (1.2)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isRtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
    const directionMultiplier = isRtl ? -1 : 1;
    const baseOffsetX = isMobile ? 0 : (1.2 * directionMultiplier);
    
    object.position.x = baseOffsetX + Math.sin(elapsed * 0.3) * 0.05;
    
    // Subtle Z drift
    object.position.z = Math.cos(elapsed * 0.4) * 0.04;
    
    // Continuous 360-degree rotation on Y (with a subtle wobble on X)
    object.rotation.y = elapsed * 0.4;
    object.rotation.x = Math.cos(elapsed * 0.25) * 0.05;
  }

  // ============================
  // SCROLL-DRIVEN ANIMATIONS
  // ============================

  /** Scroll-triggered: float the Hero door upward + scale */
  setupDoorScroll(
    doorGroup: THREE.Object3D,
    triggerElement: HTMLElement
  ): void {
    if (!this.gsap || !this.ScrollTrigger) return;

    const proxy = { yOffset: 0, scale: 0.85 };

    this.gsap.to(proxy, {
      yOffset: 1.5,
      scale: 1.0,
      ease: 'sine.inOut',
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: () => {
          doorGroup.position.y += (proxy.yOffset - doorGroup.position.y) * 0.1;
        },
      },
    });
  }

  /** Entrance animations with matchMedia for mobile optimization */
  setupEntranceAnimations(container: HTMLElement): void {
    if (!this.gsap || !this.ScrollTrigger || !this.mm) return;

    this.mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context: any) => {
      const { isMobile } = context.conditions;
      const yOffset = isMobile ? 30 : 60; // Reduced Y jump for mobile

      // Scroll-triggered animations for [data-animate] elements
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
              start: isMobile ? 'top 95%' : 'top 90%',
              invalidateOnRefresh: true,
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Immediate animations for [data-animate-hero] elements on load
      const heroElements = container.querySelectorAll('[data-animate-hero]');
      if (heroElements.length) {
        this.gsap.fromTo(
          heroElements,
          {
            opacity: 0,
            y: yOffset,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'sine.inOut',
            delay: 0.2 // slight delay to ensure render
          }
        );
      }

      return () => {
        // Cleanup if needed
      };
    });
  }

  /** Parallax float for installation grid cards */
  setupParallax(container: HTMLElement): void {
    if (!this.gsap || !this.ScrollTrigger) return;

    const cards = container.querySelectorAll('[data-depth]');
    cards.forEach((card) => {
      const depth = parseFloat((card as HTMLElement).dataset['depth'] || '1');
      const yMove = depth * 40;

      this.gsap.fromTo(
        card,
        { y: yMove },
        {
          y: -yMove,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });
  }

  /** Lightbox open animation */
  openLightbox(overlay: HTMLElement, image: HTMLElement): void {
    if (!this.gsap) return;
    this.gsap.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    this.gsap.fromTo(
      image,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }

  /** Lightbox close animation */
  closeLightbox(overlay: HTMLElement, onComplete: () => void): void {
    if (!this.gsap) return;
    this.gsap.to(overlay, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete,
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

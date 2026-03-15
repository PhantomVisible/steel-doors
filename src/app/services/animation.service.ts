import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { ExplodedDoorParts } from './exploded-door.service';

/**
 * AnimationService
 * Manages all GSAP + ScrollTrigger-driven animations and the zero-G levitation math.
 * GSAP is loaded dynamically to avoid SSR issues.
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private gsap: any;
  private ScrollTrigger: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Load GSAP + ScrollTrigger dynamically */
  async loadGsap(): Promise<void> {
    if (!this.isBrowser) return;
    const gsapModule = await import('gsap');
    const stModule = await import('gsap/ScrollTrigger');
    this.gsap = gsapModule.gsap || gsapModule.default;
    this.ScrollTrigger = stModule.ScrollTrigger || stModule.default;
    this.gsap.registerPlugin(this.ScrollTrigger);
  }

  // ============================
  // ZERO-GRAVITY LEVITATION
  // ============================

  /** Apply sine-wave levitation to a Three.js object */
  applyLevitation(object: THREE.Object3D, elapsed: number): void {
    // Primary Y float
    object.position.y = Math.sin(elapsed * 0.8) * 0.15;
    // Push the door to the right to make room for the text on the left
    object.position.x = 1.2 + Math.sin(elapsed * 0.3) * 0.05;
    // Subtle Z drift
    object.position.z = Math.cos(elapsed * 0.4) * 0.04;
    
    // Continuous 360-degree rotation on Y (with a subtle wobble on X)
    object.rotation.y = elapsed * 0.4;
    object.rotation.x = Math.cos(elapsed * 0.25) * 0.05;
  }

  // ============================
  // SCROLL-DRIVEN ANIMATIONS
  // ============================

  /** Scroll-triggered: float the 3D door upward + scale */
  setupDoorScroll(
    doorGroup: THREE.Object3D,
    triggerElement: HTMLElement
  ): void {
    if (!this.gsap || !this.ScrollTrigger) return;

    // We use a proxy object that we read in the render loop
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

  /** Scroll-triggered: Assemble exploded door in About section */
  setupExplodedDoorScroll(
    parts: ExplodedDoorParts,
    triggerElement: HTMLElement
  ): void {
    if (!this.gsap || !this.ScrollTrigger) return;

    // We want them to gently float to z = 0 as the user scrubs through the section.
    
    const tl = this.gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: 'top 80%', // start animating when section is 80% down viewport
        end: 'center center', // finish assembling when section is in middle
        scrub: 1.5, // smooth scrubbing
      }
    });

    // Animate everything to Z = 0
    tl.to(parts.layer1_backWood.position, { z: 0, ease: 'sine.inOut' }, 0);
    tl.to(parts.layer2_backFoam.position, { z: 0, ease: 'sine.inOut' }, 0);
    tl.to(parts.layer3_skeleton.position, { z: 0, ease: 'sine.inOut' }, 0);
    tl.to(parts.layer4_frontFoam.position, { z: 0, ease: 'sine.inOut' }, 0);
    tl.to(parts.layer5_frontWood.position, { z: 0, ease: 'sine.inOut' }, 0);
    
    // Fade out labels
    const labelsContainer = document.querySelector('.about__labels');
    if (labelsContainer) {
      tl.to(labelsContainer, { opacity: 0, ease: 'power1.inOut' }, 0);
    }

    // Also gently rotate the door group back to flat/straight a bit
    tl.to(parts.group.rotation, { y: Math.PI / 8, ease: 'sine.inOut' }, 0);
    
    // And float it slightly Y
    tl.to(parts.group.position, { y: 0.2, ease: 'sine.inOut' }, 0);
  }

  /** Animate [data-animate] elements into view — weightless entrance */
  setupEntranceAnimations(container: HTMLElement): void {
    if (!this.gsap || !this.ScrollTrigger) return;

    // Scroll-triggered animations for elements further down
    const elements = container.querySelectorAll('[data-animate]');
    elements.forEach((el, i) => {
      this.gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          delay: i * 0.08,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Immediate animations for hero elements on load
    const heroElements = container.querySelectorAll('[data-animate-hero]');
    if (heroElements.length) {
      this.gsap.fromTo(
        heroElements,
        {
          opacity: 0,
          y: 60,
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

  /** Animate a 3D object's position property springing back to a target */
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
      z: originalZ + dir * 5.0, // Move significantly far out
      duration: 0.6,
      ease: 'power2.inOut'
    });
  }

  /** Reset object back to its start position with a clean elastic pop */
  animateReset(object: THREE.Object3D, targetZ: number): void {
    if (!this.gsap) return;
    this.gsap.to(object.position, {
      z: targetZ,
      duration: 1.0,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  /** Refresh ScrollTrigger (call after DOM changes) */
  refresh(): void {
    this.ScrollTrigger?.refresh();
  }

  /** Kill all ScrollTriggers */
  dispose(): void {
    this.ScrollTrigger?.getAll().forEach((st: any) => st.kill());
  }
}

import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { AnimationService } from '../../services/animation.service';
import { AboutSceneService } from '../../services/about-scene.service';
import { ExplodedDoorService, ExplodedDoorParts } from '../../services/exploded-door.service';

interface AboutSlide {
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('aboutCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer', { static: false }) containerRef!: ElementRef<HTMLElement>;

  // Labels for the 5 door layers
  @ViewChild('labelFrontWood', { static: false }) labelFrontWoodRef!: ElementRef<HTMLElement>;
  @ViewChild('labelFrontFoam', { static: false }) labelFrontFoamRef!: ElementRef<HTMLElement>;
  @ViewChild('labelSkeleton', { static: false }) labelSkeletonRef!: ElementRef<HTMLElement>;
  @ViewChild('labelBackFoam', { static: false }) labelBackFoamRef!: ElementRef<HTMLElement>;
  @ViewChild('labelBackWood', { static: false }) labelBackWoodRef!: ElementRef<HTMLElement>;

  private explodedParts!: ExplodedDoorParts;

  // Custom Raycasting Drag interaction
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private draggedLayer: THREE.Object3D | null = null;
  private dragStartX = 0;
  private layerStartZ = 0;
  private intersectableObjects: THREE.Object3D[] = [];
  private layerOriginalZ = new Map<THREE.Object3D, number>();
  swipedLayers = new Set<THREE.Object3D>();
  private hoveredLayer: THREE.Object3D | null = null;

  slides: AboutSlide[] = [
    { 
      title: 'Installation partout au Maroc', 
      description: "Nous assurons l'installation professionnelle de votre porte n'importe où au Maroc, en vous garantissant un service fiable et le prix juste." 
    },
    { 
      title: 'Sécurité et Blindage', 
      description: "Dotées d'un squelette interne en acier de 1,5 à 2 mm d'épaisseur et d'un système de verrouillage multipoints à 4 zones pour une protection absolue contre les effractions." 
    },
    { 
      title: 'Finitions Durables et Étanchéité', 
      description: "Des revêtements effet bois naturel ou stratifié résistants à l'humidité, accompagnés d'un double joint d'étanchéité pour une isolation parfaite face aux intempéries." 
    }
  ];

  activeSlideIndex = 0;
  private intervalId: any;

  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    private aboutSceneService: AboutSceneService,
    private explodedDoorService: ExplodedDoorService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startSlider();
    }
  }

  startSlider(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
  }

  setSlide(index: number): void {
    this.activeSlideIndex = index;
    if (this.isBrowser && this.intervalId) {
      clearInterval(this.intervalId);
      this.startSlider(); // Restart interval on manual interactions
    }
  }

  private updateLabelPosition(anchor: THREE.Object3D, labelEl: HTMLElement | undefined) {
    if (!labelEl || !this.containerRef) return;
    
    // Hide label if the parent layer has been swiped away, OR if not currently hovered/dragged
    if (
      (anchor.parent && this.swipedLayers.has(anchor.parent)) ||
      (anchor.parent !== this.hoveredLayer && anchor.parent !== this.draggedLayer)
    ) {
      labelEl.style.display = 'none';
      return;
    }

    // Get absolute position of the anchor in the world
    const vector = new THREE.Vector3();
    anchor.getWorldPosition(vector);
    
    // Project to NDC space (-1 to +1)
    vector.project(this.aboutSceneService.camera);
    
    // Convert NDC to 2D CSS coordinates relative to the canvas container
    const container = this.containerRef.nativeElement;
    const widthHalf = container.clientWidth / 2;
    const heightHalf = container.clientHeight / 2;
    
    const x = (vector.x * widthHalf) + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;
    
    // Prevent rendering if the object is behind the camera (z > 1)
    if (vector.z > 1) {
      labelEl.style.display = 'none';
      return;
    }
    
    labelEl.style.display = 'flex';
    // Offset by -3px for the 6x6 anchor dot center to perfectly align
    labelEl.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
  }

  // ---- Interaction Events ----
  private getIntersects(event: PointerEvent): THREE.Intersection[] {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.aboutSceneService.camera);
    return this.raycaster.intersectObjects(this.intersectableObjects, true);
  }

  private onPointerDown = (event: PointerEvent) => {
    const intersects = this.getIntersects(event);
    if (intersects.length > 0) {
      let hitObject: THREE.Object3D | null = intersects[0].object;
      while (hitObject && !this.intersectableObjects.includes(hitObject)) {
        hitObject = hitObject.parent;
      }
      if (hitObject && !this.swipedLayers.has(hitObject)) {
        this.draggedLayer = hitObject;
        this.dragStartX = event.clientX;
        this.layerStartZ = this.draggedLayer.position.z;
        document.body.style.cursor = 'grabbing';
        this.canvasRef.nativeElement.setPointerCapture(event.pointerId);
      }
    }
  };

  private onPointerMove = (event: PointerEvent) => {
    if (this.draggedLayer) {
      // User requested: "slide each part from left to right"
      const deltaX = event.clientX - this.dragStartX;
      const sensitivity = 0.005; 
      
      // Calculate new Z
      const newZ = this.layerStartZ + deltaX * sensitivity;
      this.draggedLayer.position.z = newZ;
      this.hoveredLayer = null;
    } else {
      const intersects = this.getIntersects(event);
      let hitObject: THREE.Object3D | null = null;
      if (intersects.length > 0) {
        hitObject = intersects[0].object;
        while (hitObject && !this.intersectableObjects.includes(hitObject)) {
          hitObject = hitObject.parent;
        }
      }

      if (hitObject && !this.swipedLayers.has(hitObject)) {
        this.hoveredLayer = hitObject;
        document.body.style.cursor = 'grab';
      } else {
        this.hoveredLayer = null;
        document.body.style.cursor = 'default';
      }
    }
  };

  private onPointerUp = (event: PointerEvent) => {
    if (this.draggedLayer) {
      const deltaX = event.clientX - this.dragStartX;
      const originalZ = this.layerOriginalZ.get(this.draggedLayer) || 0;
      
      // If user swiped more than ~80 pixels, permanently swipe it away
      if (Math.abs(deltaX) > 80) {
        const dir = Math.sign(deltaX);
        this.animationService.animateSwipeAway(this.draggedLayer, originalZ, dir);
        this.swipedLayers.add(this.draggedLayer);
      } else {
        // Did not meet threshold, spring back normally
        this.animationService.animateSpringBack(this.draggedLayer, originalZ);
      }
      
      this.draggedLayer = null;
      this.hoveredLayer = null;
      document.body.style.cursor = 'default';
      this.canvasRef.nativeElement.releasePointerCapture(event.pointerId);
    }
  };

  resetLayers(): void {
    this.swipedLayers.forEach(layer => {
      const originalZ = this.layerOriginalZ.get(layer) || 0;
      this.animationService.animateReset(layer, originalZ);
    });
    this.swipedLayers.clear();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    
    // Init the About-specific 3D scene
    if (this.canvasRef && this.containerRef) {
      this.aboutSceneService.init(this.canvasRef.nativeElement, this.containerRef.nativeElement);
      
      // Create and add the exploded door
      this.explodedParts = this.explodedDoorService.createExplodedDoor();
      this.aboutSceneService.scene.add(this.explodedParts.group);

      // Collect root intersectable layers
      this.intersectableObjects = [
        this.explodedParts.layer1_backWood,
        this.explodedParts.layer2_backFoam,
        this.explodedParts.layer3_skeleton,
        this.explodedParts.layer4_frontFoam,
        this.explodedParts.layer5_frontWood
      ];
      this.intersectableObjects.forEach(layer => {
        this.layerOriginalZ.set(layer, layer.position.z);
      });

      // Bind canvas events
      const canvas = this.canvasRef.nativeElement;
      canvas.addEventListener('pointerdown', this.onPointerDown);
      canvas.addEventListener('pointermove', this.onPointerMove);
      canvas.addEventListener('pointerup', this.onPointerUp);
      canvas.addEventListener('pointerleave', this.onPointerUp);

      // Start render loop (with subtle levitation on the whole group)
      this.aboutSceneService.startLoop((elapsed: number) => {
        // Just a subtle float on the assembled group
        this.explodedParts.group.position.y = Math.sin(elapsed * 1.2) * 0.05;

        // Sync HTML labels to 3D anchor points
        this.updateLabelPosition(this.explodedParts.anchors.frontWood, this.labelFrontWoodRef?.nativeElement);
        this.updateLabelPosition(this.explodedParts.anchors.frontFoam, this.labelFrontFoamRef?.nativeElement);
        this.updateLabelPosition(this.explodedParts.anchors.skeleton, this.labelSkeletonRef?.nativeElement);
        this.updateLabelPosition(this.explodedParts.anchors.backFoam, this.labelBackFoamRef?.nativeElement);
        this.updateLabelPosition(this.explodedParts.anchors.backWood, this.labelBackWoodRef?.nativeElement);
      });
    }

    await this.animationService.loadGsap();
    setTimeout(() => {
      this.animationService.setupEntranceAnimations(this.sectionRef.nativeElement);
      // Removed the automated explosion/assembly scroll trigger per user request
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.canvasRef) {
      const canvas = this.canvasRef.nativeElement;
      canvas.removeEventListener('pointerdown', this.onPointerDown);
      canvas.removeEventListener('pointermove', this.onPointerMove);
      canvas.removeEventListener('pointerup', this.onPointerUp);
      canvas.removeEventListener('pointerleave', this.onPointerUp);
    }
    document.body.style.cursor = 'default';

    if (this.intervalId) clearInterval(this.intervalId);
    this.aboutSceneService.dispose();
  }
}

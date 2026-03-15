import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  private explodedParts!: ExplodedDoorParts;

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

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    
    // Init the About-specific 3D scene
    if (this.canvasRef && this.containerRef) {
      this.aboutSceneService.init(this.canvasRef.nativeElement, this.containerRef.nativeElement);
      
      // Create and add the exploded door
      this.explodedParts = this.explodedDoorService.createExplodedDoor();
      this.aboutSceneService.scene.add(this.explodedParts.group);

      // Start render loop (with subtle levitation on the whole group)
      this.aboutSceneService.startLoop((elapsed: number) => {
        // Just a subtle float on the assembled group
        this.explodedParts.group.position.y = Math.sin(elapsed * 1.2) * 0.05;
      });
    }

    await this.animationService.loadGsap();
    setTimeout(() => {
      this.animationService.setupEntranceAnimations(this.sectionRef.nativeElement);
      // Setup the scroll trigger to merge the pieces
      if (this.explodedParts) {
         this.animationService.setupExplodedDoorScroll(this.explodedParts, this.sectionRef.nativeElement);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.aboutSceneService.dispose();
  }
}

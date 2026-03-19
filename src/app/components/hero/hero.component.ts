import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ThreeSceneService } from '../../services/three-scene.service';
import { DoorModelService } from '../../services/door-model.service';
import { AnimationService } from '../../services/animation.service';
import * as THREE from 'three';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;

  private doorGroup!: THREE.Group;
  private isBrowser: boolean;

  constructor(
    private sceneService: ThreeSceneService,
    private doorService: DoorModelService,
    private animationService: AnimationService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;

    // Init Three.js scene
    this.sceneService.init(
      this.canvasRef.nativeElement,
      this.sectionRef.nativeElement
    );

    // Create procedural door and add to scene
    this.doorGroup = this.doorService.createDoor();
    this.sceneService.scene.add(this.doorGroup);

    // Start render loop with levitation
    this.sceneService.startLoop((elapsed: number) => {
      this.animationService.applyLevitation(this.doorGroup, elapsed);
    });

    // Load GSAP and set up scroll-driven door float
    await this.animationService.loadGsap();
    setTimeout(() => {
      this.animationService.setupDoorScroll(
        this.doorGroup,
        this.sectionRef.nativeElement
      );
      this.animationService.setupEntranceAnimations(
        this.sectionRef.nativeElement
      );
    }, 100);
  }

  ngOnDestroy(): void {
    this.sceneService.dispose();
  }
}

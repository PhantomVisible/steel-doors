import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;

  private isBrowser: boolean;

  constructor(
    private animationService: AnimationService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    await this.animationService.loadGsap();
    setTimeout(() => {
      this.animationService.setupEntranceAnimations(this.sectionRef.nativeElement);
    }, 100);
  }

  ngOnDestroy(): void {}
}

import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements AfterViewInit, OnDestroy {
  @ViewChild('locSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;

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

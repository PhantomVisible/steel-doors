import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements AfterViewInit {
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  private animationService = inject(AnimationService);

  ngAfterViewInit(): void {
    if (this.containerRef) {
      // Adding a brief timeout ensures the DOM has truly painted 
      // the new elements before GSAP initializes the ScrollTrigger height calculations.
      setTimeout(() => {
        this.animationService.setupEntranceAnimations(this.containerRef.nativeElement);
        this.animationService.refresh();
      }, 50);
    }
  }
}

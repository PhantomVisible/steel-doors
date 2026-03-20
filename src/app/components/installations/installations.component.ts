import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AnimationService } from '../../services/animation.service';

export interface Category {
  name: string;
  images: string[];
}

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './installations.component.html',
  styleUrls: ['./installations.component.scss'],
})
export class InstallationsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('installSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('lightboxOverlay', { static: false }) overlayRef!: ElementRef<HTMLElement>;
  @ViewChild('lightboxImg', { static: false }) lightboxImgRef!: ElementRef<HTMLElement>;

  categories: Category[] = [
    {
      name: 'Luxury Residence',
      images: [
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.16 (1).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.30.jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.32 (1).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.32.jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.33 (2).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.34 (2).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.34.jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.41 (1).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.41 (2).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.41.jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.42.jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.43 (1).jpeg',
        'categories/Luxury Residence/WhatsApp Image 2026-03-19 at 22.37.43.jpeg'
      ]
    },
    {
      name: 'Boutique',
      images: [
        'categories/Boutique/flyer.jpg',
        'categories/Boutique/store.jpg'
      ]
    },
    {
      name: 'Apartment Security Door',
      images: [
        'categories/Apartment Security Door/471198687_27997051043275352_2015553631847300804_n.jpg',
        'categories/Apartment Security Door/475767508_28389144380732681_1660592666123297767_n.jpg',
        'categories/Apartment Security Door/480645561_28574733265507124_968336391908195454_n.jpg',
        'categories/Apartment Security Door/481763978_28724259563887826_8604094557079190280_n.jpg',
        'categories/Apartment Security Door/482321325_28804944042486044_7186913488034853541_n.jpg',
        'categories/Apartment Security Door/483848848_28803030592677389_1742670755410693052_n.jpg',
        'categories/Apartment Security Door/485320983_28913385808308533_7028011948625686430_n.jpg',
        'categories/Apartment Security Door/497440059_2830634333991121_7005685660769520786_n.jpg',
        'categories/Apartment Security Door/497462343_2830642607323627_7876326993091670828_n.jpg',
        'categories/Apartment Security Door/498683381_2830976800623541_8948375979713930593_n.jpg',
        'categories/Apartment Security Door/568195168_1321556523005116_5753135555362522880_n.jpg',
        'categories/Apartment Security Door/84729685_3489190867821377_1154097556846804992_n.jpg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.36.55.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.16.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.19 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.19 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.19.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.20 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.20.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.28 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.28 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.28.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.29 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.29 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.29.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.30 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.30 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.31 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.31 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.31.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.32 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.33 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.33.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.34 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.35 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.35 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.35.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.36 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.36 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.36.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.37.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.38 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.38.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.39 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.39.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.40 (1).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.40 (2).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.40.jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.41 (3).jpeg',
        'categories/Apartment Security Door/WhatsApp Image 2026-03-19 at 22.37.42 (1).jpeg'
      ]
    },
    {
      name: 'Modern Villa Entry',
      images: [
        'categories/Modern Villa Entry/103004648_3914750271932099_54418951207891679_n.jpg',
        'categories/Modern Villa Entry/120818016_4478513928889061_3491919475740899500_n.jpg',
        'categories/Modern Villa Entry/120997466_4478513682222419_4410269241793997802_n.jpg',
        'categories/Modern Villa Entry/153023157_5082151698525278_6299217719106947188_n.jpg',
        'categories/Modern Villa Entry/67480885_2920281131379023_2603536087376723968_n.jpg',
        'categories/Modern Villa Entry/70598598_3035229606550841_2040554295362846720_n.jpg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.05.jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.06 (1).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.06.jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.34 (1).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.34.jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35 (1).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35 (2).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35 (3).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35 (4).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35 (5).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.35.jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.36 (1).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.36 (2).jpeg',
        'categories/Modern Villa Entry/WhatsApp Image 2026-03-19 at 22.31.36.jpeg'
      ]
    }
  ];

  activeCategory: Category = this.categories[0];
  selectedImage: string | null = null;
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

  selectCategory(category: Category): void {
    if (this.activeCategory !== category) {
      this.activeCategory = category;
      // Re-trigger GSAP scroll handlers or custom animations here if needed
      if (this.isBrowser && this.animationService) {
        setTimeout(() => {
          this.animationService.refresh();
        }, 50);
      }
    }
  }

  openLightbox(imageUrl: string): void {
    this.selectedImage = imageUrl;
    if (this.isBrowser && this.overlayRef && this.lightboxImgRef) {
      const overlay = this.overlayRef.nativeElement;
      const img = this.lightboxImgRef.nativeElement;
      overlay.style.pointerEvents = 'auto'; // allow clicks
      
      // Delay slightly for the image src to bind and DOM to paint
      setTimeout(() => {
        this.animationService.openLightbox(overlay, img);
      }, 10);
    }
  }

  closeLightbox(): void {
    if (this.overlayRef) {
      this.animationService.closeLightbox(this.overlayRef.nativeElement, () => {
        if (this.overlayRef) {
          this.overlayRef.nativeElement.style.pointerEvents = 'none';
        }
        this.selectedImage = null; // optional: clears src from image
      });
    }
  }

  ngOnDestroy(): void {}
}

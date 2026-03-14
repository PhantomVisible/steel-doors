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
import { AnimationService } from '../../services/animation.service';

export interface Category {
  id: number;
  title: string;
  coverImage: string;
  images: string[];
  depth: number;
}

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installations.component.html',
  styleUrls: ['./installations.component.scss'],
})
export class InstallationsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('installSection', { static: false }) sectionRef!: ElementRef<HTMLElement>;

  lightboxOpen = false;
  activeCategory: Category | null = null;
  activeImageIndex = 0;

  categories: Category[] = [
    {
      id: 1,
      title: 'Luxury Residence',
      coverImage: 'categories/Luxury Residence/ekonomik-celik-kapi-modelleri-5929996706.png',
      images: [
        'categories/Luxury Residence/ekonomik-celik-kapi-modelleri-5929996706.png'
      ],
      depth: 0.8
    },
    {
      id: 2,
      title: 'Boutique',
      coverImage: 'categories/Boutique/store.jpg',
      images: [
        'categories/Boutique/store.jpg'
      ],
      depth: 1.2
    },
    {
      id: 3,
      title: 'Apartment Security Door',
      coverImage: 'categories/Apartment Security Door/471198687_27997051043275352_2015553631847300804_n.jpg',
      images: [
        'categories/Apartment Security Door/471198687_27997051043275352_2015553631847300804_n.jpg',
        'categories/Apartment Security Door/475767508_28389144380732681_1660592666123297767_n.jpg',
        'categories/Apartment Security Door/480645561_28574733265507124_968336391908195454_n.jpg',
        'categories/Apartment Security Door/481763978_28724259563887826_8604094557079190280_n.jpg',
        'categories/Apartment Security Door/482321325_28804944042486044_7186913488034853541_n.jpg',
        'categories/Apartment Security Door/483848848_28803030592677389_1742670755410693052_n.jpg',
        'categories/Apartment Security Door/485320983_28913385808308533_7028011948625686430_n.jpg',
        'categories/Apartment Security Door/568195168_1321556523005116_5753135555362522880_n.jpg',
        'categories/Apartment Security Door/84729685_3489190867821377_1154097556846804992_n.jpg'
      ],
      depth: 0.6
    },
    {
      id: 4,
      title: 'Modern Villa Entry',
      coverImage: 'categories/Modern Villa Entry/103004648_3914750271932099_54418951207891679_n.jpg',
      images: [
        'categories/Modern Villa Entry/103004648_3914750271932099_54418951207891679_n.jpg',
        'categories/Modern Villa Entry/120818016_4478513928889061_3491919475740899500_n.jpg',
        'categories/Modern Villa Entry/120997466_4478513682222419_4410269241793997802_n.jpg',
        'categories/Modern Villa Entry/153023157_5082151698525278_6299217719106947188_n.jpg',
        'categories/Modern Villa Entry/67480885_2920281131379023_2603536087376723968_n.jpg',
        'categories/Modern Villa Entry/70598598_3035229606550841_2040554295362846720_n.jpg'
      ],
      depth: 1.0
    }
  ];

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
      this.animationService.setupParallax(this.sectionRef.nativeElement);
      this.animationService.setupEntranceAnimations(this.sectionRef.nativeElement);
    }, 100);
  }

  openLightbox(category: Category): void {
    this.activeCategory = category;
    this.activeImageIndex = 0;
    this.lightboxOpen = true;
    // Animate after DOM updates
    if (this.isBrowser) {
      setTimeout(() => {
        const overlay = document.querySelector('.lightbox') as HTMLElement;
        const img = document.querySelector('.lightbox__image') as HTMLElement;
        if (overlay && img) {
          this.animationService.openLightbox(overlay, img);
        }
      });
    }
  }

  closeLightbox(): void {
    const overlay = document.querySelector('.lightbox') as HTMLElement;
    if (overlay) {
      this.animationService.closeLightbox(overlay, () => {
        this.lightboxOpen = false;
      });
    } else {
      this.lightboxOpen = false;
    }
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    if (this.activeCategory) {
      this.activeImageIndex = (this.activeImageIndex + 1) % this.activeCategory.images.length;
    }
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    if (this.activeCategory) {
      this.activeImageIndex = (this.activeImageIndex - 1 + this.activeCategory.images.length) % this.activeCategory.images.length;
    }
  }

  ngOnDestroy(): void {}
}

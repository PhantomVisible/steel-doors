import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { HeroComponent } from './components/hero/hero.component';
import { InstallationsComponent } from './components/installations/installations.component';
import { AboutComponent } from './components/about/about.component';
import { LocationComponent } from './components/location/location.component';
import { ContactComponent } from './components/contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HeroComponent,
    InstallationsComponent,
    AboutComponent,
    LocationComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'steel-doors';
  currentLang = 'fr';

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.translate.addLangs(['fr', 'ar']);
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'fr' ? 'ar' : 'fr';
    this.translate.use(this.currentLang);
    
    // RTL logic
    const htmlTag = this.document.documentElement;
    htmlTag.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    htmlTag.lang = this.currentLang;
  }
}

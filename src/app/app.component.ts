import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SnackService } from './services/snack.service';
import { NavigationEnd, Router } from '@angular/router';
import { OnInit } from '@angular/core';

declare let gtag: Function;

const GITHUB_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.58 31.77">
    <path d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"/>
  </svg>
`;

const LINKEDIN_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" class="linkedin-logo">
    <path d="M34,2.5v29A2.5,2.5,0,0,1,31.5,34H2.5A2.5,2.5,0,0,1,0,31.5V2.5A2.5,2.5,0,0,1,2.5,0h29A2.5,2.5,0,0,1,34,2.5ZM10,13H5V29h5Zm.45-5.5A2.88,2.88,0,0,0,7.59,4.6H7.5a2.9,2.9,0,0,0,0,5.8h0a2.88,2.88,0,0,0,2.95-2.81ZM29,19.28c0-4.81-3.06-6.68-6.1-6.68a5.7,5.7,0,0,0-5.06,2.58H17.7V13H13V29h5V20.49a3.32,3.32,0,0,1,3-3.58h.19c1.59,0,2.77,1,2.77,3.52V29h5Z"/>
  </svg>
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  email = 'pmark.pt@gmail.com';
  emailTooltip = 'pmark.pt@gmail.com\nClick to copy';
  isSmallScreen = false;

  constructor(
    iconReg: MatIconRegistry,
    domSanitizer: DomSanitizer,
    private router: Router
  ) {
    iconReg.addSvgIconLiteral(
      'linkedin',
      domSanitizer.bypassSecurityTrustHtml(LINKEDIN_ICON)
    );
    iconReg.addSvgIconLiteral(
      'github',
      domSanitizer.bypassSecurityTrustHtml(GITHUB_ICON)
    );
  }

  ngOnInit() {
    this.setupAnalytics();
  }

  private setupAnalytics() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-V1KFSE9JPL', { page_path: event.urlAfterRedirects });
      }
    });
  }
}

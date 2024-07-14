import { Component } from '@angular/core';
import { LinkedinLogoComponent } from '../linkedin-logo/linkedin-logo.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [LinkedinLogoComponent],
})
export class HomePageComponent {}

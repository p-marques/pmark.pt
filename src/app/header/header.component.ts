import { Component, OnInit } from '@angular/core';
import { AppColorService } from '../services/app-color.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public fillColor: string | undefined;

  constructor(public colorService: AppColorService) {}
}

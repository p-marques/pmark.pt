import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

import { AppColorService } from '../services/app-color.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private introLines = [
    'develop web apps',
    'develop desktop apps',
    'love Angular',
    'love video games',
    'have worked with .Net Core since rc1',
    'love modding games',
  ];
  private currentIndex: number = Math.floor(
    Math.random() * this.introLines.length
  );
  private subscription: Subscription;

  constructor(
    private titleService: Title,
    public colorService: AppColorService
  ) {
    this.subscription = interval(5000).subscribe((_) => this.moveToNextIndex());
  }

  public ngOnInit() {
    this.titleService.setTitle('Pedro Dias Marques');
  }

  public getCurrentLine(): string {
    return this.introLines[this.currentIndex];
  }

  private moveToNextIndex(): void {
    if (this.currentIndex + 1 === this.introLines.length) {
      this.currentIndex = 0;
    }

    this.currentIndex++;
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

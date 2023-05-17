import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { interval, Subscription } from 'rxjs';

import { AppColorService } from '../services/app-color.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private introLines = [
    'I build web apps.',
    'I\'m a big fan of Angular.',
    'I love video games, and modding them.',
    'I also like to develop desktop apps, using .Net or Python.',
  ];
  private currentIndex: number = 0;
  private subscription: Subscription;

  constructor(
    private titleService: Title,
    public colorService: AppColorService,
    public snackService: SnackService
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

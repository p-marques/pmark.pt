import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppColorService {
  private colors = [
    '#537188',
    '#00FFD2',
    '#A0D8B3',
    '#57C5B6',
    '#FD0130',
    '#FF4B68',
    '#FCEE0A',
    '#C69749',
    '#CCCCCC',
  ];
  private currentIndex: number = Math.floor(Math.random() * this.colors.length);

  public getColors(): string[] {
    return this.colors;
  }

  public getCurrentColor(): string {
    return this.colors[this.currentIndex];
  }

  public setCurrentColorIndex(index: number): void {
    this.currentIndex = index;
  }
}

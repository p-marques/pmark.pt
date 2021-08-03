import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    ClipboardModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    ClipboardModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule
  ]
})
export class MaterialModule { }

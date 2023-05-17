import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  exports: [
    MatIconModule,
    ClipboardModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatExpansionModule
  ]
})
export class MaterialModule { }

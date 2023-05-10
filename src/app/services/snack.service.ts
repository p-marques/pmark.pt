import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar, MatLegacySnackBarConfig as MatSnackBarConfig } from '@angular/material/legacy-snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackService {

    constructor(private snackBar: MatSnackBar) {}

    public showSnackBar(message: string, action?: string | undefined, options?: MatSnackBarConfig<any> | undefined) {
        this.snackBar.open(message, action, options);
    }
}
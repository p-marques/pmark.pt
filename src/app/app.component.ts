import { Component } from '@angular/core';
import { AppMenuComponent } from './app-menu/app-menu.component';
import { RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, AppMenuComponent]
})
export class AppComponent { }

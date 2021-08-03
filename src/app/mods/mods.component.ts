import { Component } from '@angular/core';
import { NexusGame } from '../core/nexus-game';
import { NexusModsService } from '../services/nexus-mods.service';

@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.css']
})
export class ModsComponent {
  name = 'Nothing'

  constructor(private nexusService: NexusModsService) { }

  doStuff() {
    this.nexusService.getGameDetails('cyberpunk2077')
      .subscribe((data: NexusGame) => this.name = data.name);
  }
}

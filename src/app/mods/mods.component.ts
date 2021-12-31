import { Component, OnInit } from '@angular/core';
import { NexusMod } from '../core/nexus-mod';
import { NexusModsCollection } from '../core/nexus-mods-collection';
import { NexusModsService } from '../services/nexus-mods.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.css']
})
export class ModsComponent implements OnInit {
  private modsCollections: NexusModsCollection[] = [];
  isWorking: boolean = true;
  mods: NexusMod[] = [];
  sortedMods: NexusMod[] = this.mods.sort(this.sortFunction);

  constructor(private nexusModsService: NexusModsService, private snackService: SnackService) {}
  
  ngOnInit(): void {
    this.nexusModsService.getModCollectionDb()
      .subscribe((data: NexusModsCollection[]) => {
        this.modsCollections = data;
        this.getMods();
        this.isWorking = false;
      }, (error: any) => this.snackService.showSnackBar(error, 'OK'));
  }

  private getMods() {
    for (let i = 0; i < this.modsCollections.length; i++) {
      const modCollection = this.modsCollections[i];
      
      for (let j = 0; j < modCollection.modIds.length; j++) {
        const modId = modCollection.modIds[j];
        
        this.nexusModsService.getModDetails(modCollection.domainName, modId)
          .subscribe((data: NexusMod) => this.mods.push(data), 
            (error: any) => this.snackService.showSnackBar(error, 'OK'));
      }
    }
  }

  private sortFunction(modA: NexusMod, modB: NexusMod) : number {
    if (modA.endorsementCount > modB.endorsementCount) {
      return 1;
    }
    
    if (modA.endorsementCount < modB.endorsementCount) {
      return -1;
    }

    return 0;
  }
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NexusMod } from '../core/nexus-mod';
import { NexusModsCollection } from '../core/nexus-mods-collection';
import { NexusModsService } from '../services/nexus-mods.service';
import { SnackService } from '../services/snack.service';
import { AppColorService } from '../services/app-color.service';

@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styleUrls: ['./mods.component.css']
})
export class ModsComponent implements OnInit {
  private modsCollections: NexusModsCollection[] = [];
  isWorking: boolean = true;
  modsWitcher3: NexusMod[] = [];
  modsWitcher2: NexusMod[] = [];
  modsCyberpunk2077: NexusMod[] = [];

  constructor(private nexusModsService: NexusModsService,
    private snackService: SnackService,
    private titleService: Title,
    public colorService: AppColorService) { }

  ngOnInit(): void {
    this.nexusModsService.getModCollectionDb()
      .subscribe((data: NexusModsCollection[]) => {
        this.modsCollections = data;
        this.getMods();
      }, (error: any) => this.snackService.showSnackBar(error, 'OK'));

      this.titleService.setTitle("Mods | Pedro Dias Marques <> pMarK");
  }

  private getMods() {
    for (let i = 0; i < this.modsCollections.length; i++) {
      const modCollection = this.modsCollections[i];

      const modsArray = this.getModsByDomainName(modCollection.domainName);

      if (modsArray == undefined) {
        if (this.modsCollections.length == i + 1) {
          this.finishLoading();
        }

        continue;
      }

      for (let j = 0; j < modCollection.modIds.length; j++) {
        const modId = modCollection.modIds[j];

        this.nexusModsService.getModDetails(modCollection.domainName, modId)
          .subscribe((data: NexusMod) => {
            modsArray.push(data);

            if (this.modsCollections.length == i + 1 && modCollection.modIds.length == j + 1) {
              this.finishLoading();
            }

          }, (error: any) => this.snackService.showSnackBar(error, 'OK'));
      }
    }
  }

  private getModsByDomainName(domainName: string) : NexusMod[] | undefined {
    if (domainName == "witcher3") {
      return this.modsWitcher3;
    }
    else if (domainName == "cyberpunk2077") {
      return this.modsCyberpunk2077;
    }
    else if (domainName == "witcher2") {
      return this.modsWitcher2;
    }
    else {
      return;
    }
  }

  private finishLoading() {
    this.modsWitcher3.sort(this.sortFunction);
    this.modsCyberpunk2077.sort(this.sortFunction);
    this.modsWitcher2.sort(this.sortFunction);

    this.isWorking = false;
  }

  private sortFunction(modA: NexusMod, modB: NexusMod) {
    return modB.endorsement_count - modA.endorsement_count;
  }
}

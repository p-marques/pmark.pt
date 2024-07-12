import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { NexusModsCollection } from '../core/nexus-mods-collection';
import { NexusMod } from '../core/nexus-mods';

@Injectable({
  providedIn: 'root',
})
export class ModsService {
  private urlMods = 'http://localhost:7071/api/mods';
  private urlModsCollectionDb = '/assets/data/mod-collection-db.json';
  private http = inject(HttpClient);

  public getModDetails(domainName: string, modId: number): Promise<NexusMod> {
    return lastValueFrom(
      this.http.get<NexusMod>(`${this.urlMods}/${domainName}/${modId}`)
    );
  }

  public getModCollectionDb(): Promise<NexusModsCollection[]> {
    return lastValueFrom(
      this.http.get<NexusModsCollection[]>(this.urlModsCollectionDb)
    );
  }
}

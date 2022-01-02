import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NexusMod } from '../core/nexus-mod';
import { NexusModsCollection } from '../core/nexus-mods-collection';

@Injectable({
  providedIn: 'root'
})
export class NexusModsService {
  private urlMods = '/api/mods';
  private urlModsCollectionDb = '/assets/data/mod-collection-db.json';
  

  constructor(private http: HttpClient) {}

  public getModDetails(domainName: string, modId: number): Observable<NexusMod> {
    return this.http.get<NexusMod>(`${this.urlMods}/${domainName}/${modId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  public getModCollectionDb(): Observable<NexusModsCollection[]> {
    return this.http.get<NexusModsCollection[]>(this.urlModsCollectionDb)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`API request failed with code: ${error.status}`);
  }
}

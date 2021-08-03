import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NexusGame } from '../core/nexus-game';

const nexusKey = process.env.NEXUS_MODS_API_KEY;

const httpOptions = {
  headers: new HttpHeaders({
    'apikey': <string>nexusKey
  })
};

@Injectable({
  providedIn: 'root'
})
export class NexusModsService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }



  public getGameDetails(gameDomainName: string): Observable<NexusGame> {
    return this.http.get<NexusGame>(this.baseUrl + 'games/' + gameDomainName, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}

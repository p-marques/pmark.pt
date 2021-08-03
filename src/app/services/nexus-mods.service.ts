import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NexusGame } from '../core/nexus-game';

@Injectable({
  providedIn: 'root'
})
export class NexusModsService {
  private baseUrl = 'https://api.nexusmods.com/v1/';

  httpOptions = {
    // headers: new HttpHeaders({
    //   'apikey': <string>process.env.NEXUS_API_KEY
    // })
  };

  constructor(private http: HttpClient) { }

  public getGameDetails(gameDomainName: string): Observable<NexusGame> {
    return this.http.get<NexusGame>(this.baseUrl + 'games/' + gameDomainName, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }
}

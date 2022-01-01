import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalStatusService {
  private url = '/api/status';

  constructor(private http: HttpClient) {}

  public getPersonalStatus() {
    return this.http.get(this.url, { responseType: "text" })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`API request failed with code: ${error.status}`);
  }
}

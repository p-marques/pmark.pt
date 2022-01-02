import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project } from '../core/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private url = '/assets/data/projects-db.json';

  constructor(private http: HttpClient) {}

  public getProjectsList(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(`Failed to load projects list. Try again later`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './User';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private auth = 'https://accounts.spotify.com';
  private api = 'https://api.spotify.com/v1';
  private cid = environment.clientId;
  private redirect = environment.redirectUrl;
  private token = '';

  user: User = {} as User;

  constructor(private http: HttpClient) {}

  authorizationLink(): string {
    const scopes =
      'user-library-read playlist-modify-public playlist-modify-private';
    return `${this.auth}/authorize/?response_type=token&client_id=${
      this.cid
    }&scope=${encodeURIComponent(scopes)}&redirect_uri=${this.redirect}`;
  }

  extractToken(): boolean {
    const location = window.location;
    if (location.hash && location.hash != '') {
      const hash = location.hash.substring(1).split('=');
      window.history.replaceState({}, document.title, '');
      this.token = hash && hash[0] === 'access_token' ? hash[1] : '';
      this.token = this.token.split('&')[0];

      this.getUserInfo().subscribe((res) => {
        this.user = {
          id: res.id,
          name: res.display_name,
        };
      });
      return true;
    }

    return false;
  }

  getUserInfo(): Observable<any> {
    const header = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
    };
    const url = `${this.api}/me`;
    return this.http.get<any>(url, header).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getSavedSongs(offset: number = 0): Observable<any> {
    const header = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
    };
    const url = `${this.api}/me/tracks?offset=${offset}&limit=50`;
    return this.http.get<any>(url, header).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  createPlaylist(name: string): Observable<any> {
    const header = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
    };
    const url = `${this.api}/users/${this.user.id}/playlists`;
    const body = {
      name,
      public: false,
    };
    return this.http.post<any>(url, body, header).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  addTracks(playlist: string, tracks): Observable<any> {
    const header = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.token }),
    };
    const url = `${this.api}/playlists/${playlist}/tracks`;
    const body = {
      uris: tracks,
    };
    return this.http.post<any>(url, body, header).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

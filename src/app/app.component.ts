import { Component } from '@angular/core';
import { SpotifyService } from './spotify.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'spotitool';
  url: string;
  hasToken: boolean = false;
  devMode: boolean = true;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.url = this.spotifyService.authorizationLink();
    this.hasToken = this.spotifyService.extractToken();
  }
}

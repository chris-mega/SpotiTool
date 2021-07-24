import { Component, OnInit } from '@angular/core';
import { Song } from '../Song';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.css'],
})
export class SongListComponent implements OnInit {
  songs: Song[] = [];
  preview: Song[] = [];
  start: number = 0;
  loadingSongs: boolean = false;
  username: string = '';
  special: boolean = false;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getSongs();
  }

  getSongs(): void {
    this.loadingSongs = true;
    this.spotifyService.getSavedSongs(this.start).subscribe((res) => {
      for (var i = 0; i < res.items.length; i++) {
        const { track } = res.items[i];
        this.songs.push({
          name: track.name,
          href: track.external_urls.spotify,
          artist: track.artists[0].name,
          uri: track.uri,
          id: this.start + i,
        } as Song);
      }
      this.start += 50;
      this.loadingSongs = false;
    });
  }

  previewSongs(list): void {
    this.preview = [];
    list.selectedOptions.selected.forEach((item) => {
      this.preview.push(this.songs[item.value]);
    });
  }

  getUserInfo(): void {
    this.spotifyService.getUserInfo().subscribe((res) => {
      this.username = res.display_name;
      this.special = this.username.includes('Always');
    });
  }

  selectAll(checked, list): void {
    if (checked) list.selectAll();
    else list.deselectAll();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Song } from '../Song';
import { SpotifyService } from '../spotify.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PreviewDialogComponent } from '../preview-dialog/preview-dialog.component';

@Component({
  selector: 'app-preview-list',
  templateUrl: './preview-list.component.html',
  styleUrls: ['./preview-list.component.css'],
})
export class PreviewListComponent implements OnInit {
  @Input() preview: Song[] = [];
  nameFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  loading: boolean = false;

  constructor(
    private spotifyService: SpotifyService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  deleteSong(song): void {
    this.preview = this.preview.filter((obj) => obj.id !== song.id);
  }

  createPlaylist(name): void {
    this.loading = true;
    this.spotifyService.createPlaylist(name.value).subscribe((playlist) => {
      const uris = [];
      this.preview.forEach((item) => {
        uris.push(item.uri);
      });

      const groups = [];
      for (var i = 0; i < uris.length; i += 100) {
        groups.push(uris.slice(i, i + 100));
      }

      groups.forEach((group) => {
        this.spotifyService.addTracks(playlist.id, group).subscribe((res) => {
          console.log(res);
          this.loading = false;

          const prevDialog = this.dialog.open(PreviewDialogComponent, {
            data: `playlist/${playlist.id}`,
          });
          prevDialog.componentInstance.playlist = true;
        });
      });
    });
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.css'],
})
export class PreviewDialogComponent implements OnInit {
  uri: string = '';
  @Input() playlist: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}

  ngOnInit(): void {
    this.uri = `https://open.spotify.com/embed/${this.data}`;
  }
}

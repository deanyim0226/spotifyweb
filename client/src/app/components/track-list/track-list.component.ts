import { Component, OnInit, Input } from '@angular/core';
import { TrackData } from 'src/app/data/track-data';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {
	@Input() tracks:TrackData[];
	@Input() hideArtist:boolean = false;
	@Input() hideAlbum:boolean = false;

  constructor() { }

  ngOnInit() {
  }

  getUrl(track:TrackData){
      return track.category + "/" + track.id;
  }
}


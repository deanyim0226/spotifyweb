import { ResourceData } from './resource-data';
import { ArtistData } from './artist-data';
import { AlbumData } from './album-data';

export class TrackData extends ResourceData {
	album:AlbumData;
	artists:ArtistData[];
	duration_ms:number;
	uri:string;
	track_number:number;

	constructor(objectModel:any) {
		super(objectModel);
		this.category = "track";

		this.artists = objectModel['artists'].map((artist:any) => {
			return new ArtistData(artist);
		});

		if(objectModel['album']) {
			this.album = new AlbumData(objectModel['album']);
		}

		this.duration_ms = objectModel['duration_ms'];
		this.uri = objectModel['uri'];
		this.track_number = objectModel['track_number'];
	}

	//Return duration_ms in X:XX form (and drop ms component)
	get durationStr() {
		var minutes:number = this.duration_ms / 60000; //60 sec/min * 100ms/sec
		var seconds:number = (this.duration_ms) / 1000 % 60; // 100ms/sec, get remainder
		return minutes.toFixed(0) + ':' + seconds.toFixed(0).padStart(2, '0');
	}
	
	get primaryArtistName() {
		return this.artists[0].name;
	}

	get primaryArtistUrl(){
		return this.artists[0].category + "/" + this.artists[0].id;
	}
	
	get albumUrl(){
		return this.album.category + "/" + this.album.id;
	}

	get albumName(){
		return this.album.name;
	}
}

import { ResourceData } from './resource-data';
import { ArtistData } from './artist-data';

export class AlbumData extends ResourceData {
	genres:string[];
	artists:ArtistData[];

	constructor(objectModel:any) {
		super(objectModel);
		this.category="album";

		this.genres = objectModel['genres'];

		this.artists = objectModel['artists'].map((artist:any) => {
			return new ArtistData(artist);
		});
	}

	getYear(){
		let temp = this.year.substring(0,4);
		return temp;
	}
}

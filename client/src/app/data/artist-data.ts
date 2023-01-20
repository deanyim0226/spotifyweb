import { ResourceData } from './resource-data';

export class ArtistData extends ResourceData {
	genres:string[];

	constructor(objectModel:any) {
		super(objectModel);
		this.category = 'artist';
		this.genres = objectModel['genres'];
	}
}

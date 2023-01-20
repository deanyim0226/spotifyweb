
export class DeviceData  {
	id:string;
	volume:number;

	constructor(objectModel:any) {
        this.id = objectModel['id'];
		this.volume = objectModel['volume_percent'];
	}

   
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ProfileData } from '../data/profile-data';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { TrackFeature } from '../data/track-feature';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  //send get request
  private sendRequestToExpress(endpoint:string):Promise<any> {

    let temp =  this.http.get(this.expressBaseUrl+endpoint).toPromise();  
    return Promise.resolve(temp);
  }
  //send post request
  private sendRequestToExpressPOST(endpoint:string):Promise<any> {
   
    let temp =  this.http.post(this.expressBaseUrl+endpoint,null).toPromise();  
    return Promise.resolve(temp);
  }

  private sendRequestToExpressStart(endpoint:string,body:any):Promise<any> {
   
    let temp =  this.http.put(this.expressBaseUrl+endpoint,body).toPromise();  
    return Promise.resolve(temp);
  }
   //send put request
  private sendRequestToExpressPUT(endpoint:string):Promise<any> {
 
    let temp =  this.http.put(this.expressBaseUrl+endpoint,null).toPromise();  
    return Promise.resolve(temp);
  }

  aboutMe():Promise<ProfileData> {
    
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  resume(device:string){
    this.sendRequestToExpressPUT('/me/player/play/'+device);
  }
  //start current song 
  start(device:string,body:any){
    this.sendRequestToExpressStart('/me/player/play/'+device,body);
  }
  //pause current song 
  pause(device:string){
    this.sendRequestToExpressPUT('/me/player/pause/'+device);
  }

  setVolume(volume:number){
    this.sendRequestToExpressPUT('/me/player/volume/' + volume);
  }
  
  playNext(device:string){
    this.sendRequestToExpressPOST('/me/player/next/'+device);
  }

  playPrevious(device:string){
    this.sendRequestToExpressPOST('/me/player/previous/'+device);
  }


  addSongToQueue(uri:string){

    this.sendRequestToExpressPOST('/me/player/queue/' + uri);
  }

  //get the list of queue
  getQueue(device:string):Promise<TrackData[]>{

    let temp = [];
    
    return this.sendRequestToExpress('/me/player/queue/'+device).then((data) => {
      console.log(data);
      temp = data['queue'].map((element:any) => {
        return new TrackData(element);
      });

      return temp;
    });
  }
/*
  getDevice(){
    return this.sendRequestToExpress('/me/player').then((data) => {
      
      return new DeviceData(data["device"]);
    });
  }
*/
  getcurrentPlayingTime(){
    return this.sendRequestToExpress('/me/player/currently-playing').then((data)=>{
      return data['progress_ms'];
    });
  }
  getCurrentPlaying(){
    return this.sendRequestToExpress('/me/player/currently-playing').then((data)=>{
      return data['item'];
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    let endcodedTrackId = encodeURIComponent(trackId);

    return this.sendRequestToExpress("/track/"+endcodedTrackId).then((data)=>{
      return new TrackData(data);
    });
  
  }
  
  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    let endcodedAlbumId = encodeURIComponent(albumId);

    return this.sendRequestToExpress("/album/"+endcodedAlbumId).then((data)=>{
      return new AlbumData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
  
    let encodedResource = encodeURIComponent(resource);
    let temp = [];
    //Based on the category, it gets data from the server and returns the list of that type of data.

    if(category === "artist"){
  
      return this.sendRequestToExpress("/search/artist/"+encodedResource).then((data) =>{
       
        temp = data["artists"]["items"].map((element:any) =>{
          return new ArtistData(element);   
        });
        return temp;
      });
 
    }else if(category === "album"){

      return this.sendRequestToExpress("/search/album/"+encodedResource).then((data) =>{
        
        temp = data["albums"]["items"].map((element:any)  =>{
          return new AlbumData(element);
        });
        return temp;
      });

    }else{

      return this.sendRequestToExpress("/search/track/"+encodedResource).then((data) =>{
        
        temp = data["tracks"]["items"].map((element:any)  =>{
        
          return new TrackData(element);
        });
        return temp;
      });
    }

  }
  
  
  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    let encodedArtistId = encodeURIComponent(artistId);
 
    return this.sendRequestToExpress("/artist/"+encodedArtistId).then((data) =>{
      return new ArtistData(data);
    });

   
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    let encodedArtistId = encodeURIComponent(artistId);
    let temp = [];

    //Based on the id, it gets data from the server and returns the list of the classes that contain data.
    return this.sendRequestToExpress("/artist-related-artists/"+encodedArtistId).then((data)=>{
      
      temp = data["artists"].map((element: any) =>{
        return new ArtistData(element); 
      });
      return temp;
    });
  
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    let encodedArtistId = encodeURIComponent(artistId);
    let temp = [];

    return this.sendRequestToExpress("/artist-top-tracks/"+encodedArtistId).then((data)=>{

      temp = data["tracks"].map((element: any) =>{
        return new TrackData(element);
      });

      return temp;
    });

  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    let encodedArtistId = encodeURIComponent(artistId);
    let temp = [];

    return this.sendRequestToExpress("/artist-albums/"+encodedArtistId).then((data) =>{

      temp = data["items"].map((element: any) =>{
        return new AlbumData(element);
      });

      return temp;
    });
   
  }


  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    let endcodedAlbumId = encodeURIComponent(albumId);
    let temp = [];

    return this.sendRequestToExpress("/album-tracks/"+ endcodedAlbumId).then((data) =>{

      temp = data["items"].map((element: any) =>{

        return new TrackData(element);
      });

      return temp;
    });

  }


  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    let endcodedTrackId = encodeURIComponent(trackId);

    let temp: any[];
  
    return this.sendRequestToExpress("/track-audio-features/" + endcodedTrackId).then((data)=>{
      
      TrackFeature.FeatureTypes.forEach(element => {
        temp.push(new TrackFeature(element,data[element]));
      })
     
      return temp;
    });

  }
}
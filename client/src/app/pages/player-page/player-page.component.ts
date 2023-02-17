import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumData } from 'src/app/data/album-data';
import { ArtistData } from 'src/app/data/artist-data';
import { TrackData } from 'src/app/data/track-data';
import { SpotifyService } from 'src/app/services/spotify.service';
import { PredictionEvent } from 'src/app/prediction-event';


@Component({
  selector: 'app-player-page',
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent implements OnInit {
  deviceId:any;
  gesture: String = "";  trackId:any;
  tracks:TrackData[];
  singleTrack:TrackData;
  albumId:string;

  volume:number;
  album:AlbumData;
  imageUrl:string;

  check:boolean;
  flag:number;
  offset:number;
  progressTime:any;

  constructor(private route: ActivatedRoute, private service: SpotifyService) { }

  async ngOnInit() {

        //get the trackid from tracklist that user selects
        this.trackId = this.route.snapshot.paramMap.get('id');
        this.flag = 0;
        this.albumId = "";
        this.offset = 0;
        this.check = true;

        //get device id, trackid, and start the song
        await this.service.getDevice().then((data)=>{

          if(data){
            this.deviceId = data.id;
            this.volume = data.volume;
    
            this.service.getTrack(this.trackId).then((data)=>{
    
              if(data){
                this.singleTrack = data;
                this.albumId = data['album'].id;
                this.offset = data.track_number;

                  var body ={
                    context_uri: "spotify:album:"+this.albumId,
                    offset: this.offset
                  }
                  console.log("initial url " +  this.albumId);
                  this.service.start(this.deviceId,body);
                  this.imageUrl = this.singleTrack.imageURL;
                  
                  console.log("inital starting");
              }
    
            });
          }
      
    });
      this.service.getQueue(this.deviceId).then((data)=>{
      this.tracks = data; //Every track in the queue, we can use this track data to display. 
      });

      this.service.getcurrentPlayingTime().then((data)=>{
          
        var minutes:number = parseInt(data) / 60000; //60 sec/min * 100ms/sec
        var seconds:number = parseInt(data) / 1000 % 60; // 100ms/sec, get remainder
        this.progressTime = minutes.toFixed(0) + ':' + seconds.toFixed(0).padStart(2, '0');
       
      //  console.log("time is" + this.progressTime);
      })

  }

  //get artists name 
  getArtistsName(artists:ArtistData[]){
    
    let name:string = "";

    artists.forEach((data)=>{
        name += data.name;
        name += ','  
    })

    let length:number = 0;
    length = name.length-1;
    name = name.substring(0,length);

    return name;
  }

  //update volume by modifying the volume bar
  updateVolume(){
  
    let temp = document.getElementById('val') as HTMLInputElement;
    this.volume = parseInt(temp.value);
    this.service.setVolume(this.volume);
  }

  //prediction 
prediction(event: PredictionEvent){
    
    this.gesture = event.getPrediction();
    this.flag += 1;
    //console.log(this.flag);

    if(this.gesture === "Open Hand"){
 
        this.service.addSongToQueue(this.trackId);
        this.service.getQueue(this.deviceId).then((data)=>{
      
          this.tracks = data; //Every track in the queue, we can use this track data to display. 
        });
        this.flag = 0;
        
        console.log("Add to Queue");
    }else if(this.gesture === "Closed Hand"){

      this.service.setVolume(0); 
      console.log("Mute");

    }else if(this.gesture === "Two Closed Hands"){

      this.service.setVolume(this.volume);

    }else if(this.gesture === "Hand Pointing"){
      this.service.resume(this.deviceId);  
      this.service.getTrack(this.trackId).then((data)=>{
            
        if(data){
          this.singleTrack = data;
    
          console.log("resume");
       
          this.imageUrl = this.singleTrack.imageURL;
          this.check = true;
          }
      });
       
    }else if(this.gesture === "Two Hands Pointing"){
        this.check = false;
        this.service.pause(this.deviceId);

        console.log("Stop Playing");

    }else if(this.gesture === "Hand Pointing & Closed Hand"){
        this.service.playPrevious(this.deviceId);
        this.service.getQueue(this.deviceId).then((data)=>{
      
          this.tracks = data; //Every track in the queue, we can use this track data to display. 
        })
        this.flag = 0;

    }else if(this.gesture === "Hand Pointing & Open Hand"){
        this.service.playNext(this.deviceId);    

        this.service.getQueue(this.deviceId).then((data)=>{
      
        this.tracks = data; //Every track in the queue, we can use this track data to display. 
        })

        this.flag = 0;
        
  
    }

    //keep updating info
    if(this.flag < 3){

      this.service.getCurrentPlaying().then((data)=>{
      
      let temp = data['uri'];
      this.trackId = temp.substring(14);

      })

      this.service.getTrack(this.trackId).then((data)=>{
      this.singleTrack = data;
      this.imageUrl = this.singleTrack.imageURL;
      })

      this.service.getQueue(this.deviceId).then((data)=>{
        this.tracks = data; //Every track in the queue, we can use this track data to display. 
        });

    }

  }

  
}
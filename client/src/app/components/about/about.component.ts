import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [ SpotifyService ]
})
export class AboutComponent implements OnInit {
  name:string = "";
  profile_pic:string = "../../../assets/unknown.jpg";
  profile_link:string = "";


  constructor(private service: SpotifyService){} 
   

  ngOnInit() {
   
  }

  getAboutMe()
  {
    this.service.aboutMe().then(response =>{
      this.name = response.name;
      this.profile_pic = response.imageURL;
      this.profile_link = response.spotifyProfile;
    });
  }



}

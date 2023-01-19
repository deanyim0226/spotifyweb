import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { HandtrackerComponent } from './handtracker/handtracker/handtracker.component';

import { CarouselCardComponent } from './components/carousel-card/carousel-card.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './components/search/search.component';
import { ThermometerComponent } from './components/thermometer/thermometer.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { ArtistPageComponent } from './pages/artist-page/artist-page.component';
import { TrackPageComponent } from './pages/track-page/track-page.component';
import { SpotifyServiceComponent } from './services/spotify.service/spotify.service.component';


@NgModule({
  declarations: [
    AppComponent,

    HomePageComponent,
    HandtrackerComponent,

    CarouselCardComponent,
    TrackListComponent,
    AboutComponent,
    SearchComponent,
    ThermometerComponent,
    AlbumPageComponent,
    ArtistPageComponent,
    TrackPageComponent,
    SpotifyServiceComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

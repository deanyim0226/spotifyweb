import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { HandtrackerComponent } from './handtracker/handtracker/handtracker.component';

import { CarouselCardComponent } from './components/carousel-card/carousel-card.component';
import { TrackListComponent } from './components/track-list/track-list.component';


@NgModule({
  declarations: [
    AppComponent,

    HomePageComponent,
    HandtrackerComponent,

    CarouselCardComponent,
    TrackListComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

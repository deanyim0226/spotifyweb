import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PlayerPageComponent } from './pages/player-page/player-page.component';
import { TrackPageComponent } from './pages/track-page/track-page.component';

const routes: Routes = [
  { path: 'track/:id', component: PlayerPageComponent},
  { path: 'track/:id', component: TrackPageComponent},
	{ path: 'album/:id', component: AlbumPageComponent},
  {path: '', component:HomePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

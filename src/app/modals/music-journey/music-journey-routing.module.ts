import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MusicJourneyPage } from './music-journey.page';

const routes: Routes = [
  {
    path: '',
    component: MusicJourneyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicJourneyPageRoutingModule {}

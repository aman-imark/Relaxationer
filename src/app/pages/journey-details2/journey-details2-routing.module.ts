import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JourneyDetails2Page } from './journey-details2.page';

const routes: Routes = [
  {
    path: '',
    component: JourneyDetails2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyDetails2PageRoutingModule {}

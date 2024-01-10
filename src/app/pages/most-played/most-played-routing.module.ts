import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostPlayedPage } from './most-played.page';

const routes: Routes = [
  {
    path: '',
    component: MostPlayedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostPlayedPageRoutingModule {}

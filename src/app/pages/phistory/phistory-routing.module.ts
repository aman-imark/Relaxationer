import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhistoryPage } from './phistory.page';

const routes: Routes = [
  {
    path: '',
    component: PhistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhistoryPageRoutingModule {}

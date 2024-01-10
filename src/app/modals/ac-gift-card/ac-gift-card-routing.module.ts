import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcGiftCardPage } from './ac-gift-card.page';

const routes: Routes = [
  {
    path: '',
    component: AcGiftCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcGiftCardPageRoutingModule {}

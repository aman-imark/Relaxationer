import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendGiftCardPage } from './send-gift-card.page';

const routes: Routes = [
  {
    path: '',
    component: SendGiftCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendGiftCardPageRoutingModule {}

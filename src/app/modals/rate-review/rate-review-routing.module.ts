import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RateReviewPage } from './rate-review.page';

const routes: Routes = [
  {
    path: '',
    component: RateReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RateReviewPageRoutingModule {}

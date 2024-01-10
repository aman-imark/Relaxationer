import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteReviewPage } from './site-review.page';

const routes: Routes = [
  {
    path: '',
    component: SiteReviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteReviewPageRoutingModule {}

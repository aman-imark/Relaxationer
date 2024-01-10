import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SiteReviewPageRoutingModule } from './site-review-routing.module';

import { SiteReviewPage } from './site-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SiteReviewPageRoutingModule
  ],
  declarations: [SiteReviewPage]
})
export class SiteReviewPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RateReviewPageRoutingModule } from './rate-review-routing.module';

import { RateReviewPage } from './rate-review.page';

import { IonRatingStarsModule } from 'ion-rating-stars';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RateReviewPageRoutingModule,
    IonRatingStarsModule
  ],
  declarations: [RateReviewPage]
})
export class RateReviewPageModule {}

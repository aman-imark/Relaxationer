import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyDetailsPageRoutingModule } from './journey-details-routing.module';

import { JourneyDetailsPage } from './journey-details.page';

import { IonRatingStarsModule } from 'ion-rating-stars';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JourneyDetailsPageRoutingModule,
    IonRatingStarsModule
  ],
  declarations: [JourneyDetailsPage]
})
export class JourneyDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JourneyDetails2PageRoutingModule } from './journey-details2-routing.module';

import { JourneyDetails2Page } from './journey-details2.page';

import { IonRatingStarsModule } from 'ion-rating-stars';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JourneyDetails2PageRoutingModule,
    IonRatingStarsModule
  ],
  declarations: [JourneyDetails2Page]
})
export class JourneyDetails2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MusicJourneyPageRoutingModule } from './music-journey-routing.module';

import { MusicJourneyPage } from './music-journey.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MusicJourneyPageRoutingModule,
  ],
  declarations: [MusicJourneyPage]
})
export class MusicJourneyPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostPlayedPageRoutingModule } from './most-played-routing.module';

import { MostPlayedPage } from './most-played.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostPlayedPageRoutingModule
  ],
  declarations: [MostPlayedPage]
})
export class MostPlayedPageModule {}

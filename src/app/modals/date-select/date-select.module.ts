import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateSelectPageRoutingModule } from './date-select-routing.module';

import { DateSelectPage } from './date-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateSelectPageRoutingModule
  ],
  declarations: [DateSelectPage]
})
export class DateSelectPageModule {}

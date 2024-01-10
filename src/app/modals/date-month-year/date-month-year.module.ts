import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateMonthYearPageRoutingModule } from './date-month-year-routing.module';

import { DateMonthYearPage } from './date-month-year.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateMonthYearPageRoutingModule
  ],
  declarations: [DateMonthYearPage]
})
export class DateMonthYearPageModule {}

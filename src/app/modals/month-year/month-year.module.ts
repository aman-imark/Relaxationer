import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonthYearPageRoutingModule } from './month-year-routing.module';

import { MonthYearPage } from './month-year.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonthYearPageRoutingModule
  ],
  declarations: [MonthYearPage]
})
export class MonthYearPageModule {}

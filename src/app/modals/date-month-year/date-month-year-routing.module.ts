import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DateMonthYearPage } from './date-month-year.page';

const routes: Routes = [
  {
    path: '',
    component: DateMonthYearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateMonthYearPageRoutingModule {}

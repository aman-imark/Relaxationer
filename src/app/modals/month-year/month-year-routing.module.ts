import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonthYearPage } from './month-year.page';

const routes: Routes = [
  {
    path: '',
    component: MonthYearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthYearPageRoutingModule {}

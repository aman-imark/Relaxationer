import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppLangPage } from './app-lang.page';

const routes: Routes = [
  {
    path: '',
    component: AppLangPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppLangPageRoutingModule {}

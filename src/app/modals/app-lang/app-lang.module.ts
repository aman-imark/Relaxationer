import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppLangPageRoutingModule } from './app-lang-routing.module';

import { AppLangPage } from './app-lang.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppLangPageRoutingModule
  ],
  declarations: [AppLangPage]
})
export class AppLangPageModule {}

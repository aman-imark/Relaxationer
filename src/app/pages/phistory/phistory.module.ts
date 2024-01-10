import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhistoryPageRoutingModule } from './phistory-routing.module';

import { PhistoryPage } from './phistory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhistoryPageRoutingModule
  ],
  declarations: [PhistoryPage]
})
export class PhistoryPageModule {}

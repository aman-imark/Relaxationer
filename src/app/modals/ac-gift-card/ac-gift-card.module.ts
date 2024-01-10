import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcGiftCardPageRoutingModule } from './ac-gift-card-routing.module';

import { AcGiftCardPage } from './ac-gift-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AcGiftCardPageRoutingModule
  ],
  declarations: [AcGiftCardPage]
})
export class AcGiftCardPageModule {}

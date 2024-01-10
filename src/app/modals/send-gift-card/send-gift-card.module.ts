import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendGiftCardPageRoutingModule } from './send-gift-card-routing.module';

import { SendGiftCardPage } from './send-gift-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SendGiftCardPageRoutingModule
  ],
  declarations: [SendGiftCardPage]
})
export class SendGiftCardPageModule {}

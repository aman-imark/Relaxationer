import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscribePlanPageRoutingModule } from './subscribe-plan-routing.module';

import { SubscribePlanPage } from './subscribe-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubscribePlanPageRoutingModule
  ],
  declarations: [SubscribePlanPage]
})
export class SubscribePlanPageModule {}

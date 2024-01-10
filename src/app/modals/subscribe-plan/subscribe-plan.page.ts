import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-subscribe-plan',
  templateUrl: './subscribe-plan.page.html',
  styleUrls: ['./subscribe-plan.page.scss'],
})
export class SubscribePlanPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };


  constructor(private modalCtrl: ModalController) { }




  dismiss() {
    // this.returnSortValue = {'sort': this.mwsortValue};
    this.modalCtrl.dismiss();
    // this.popCtrl.dismiss({'dismissed': true});
  } 



  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-app-lang',
  templateUrl: './app-lang.page.html',
  styleUrls: ['./app-lang.page.scss'],
})
export class AppLangPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ionViewWillEnter(){
    //  console.log(this.mwsortValue);
  }


   dismiss() {
      // this.returnSortValue = {'sort': this.mwsortValue};
      // this.modalCtrl.dismiss(this.returnSortValue);
      this.modalCtrl.dismiss({'dismissed': true});
   } 

  ngOnInit() {
  }

}

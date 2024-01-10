import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class ExtraService {

  loading;

   constructor(private platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }


  async show() {
    this.loading = await this.loadingCtrl.create({
      duration: 7000
    });
    this.loading.present();
  }


  hide() {
    try {
      this.loading.dismiss();
    } catch (error) { }
  }


  async autoHide(time) {
    this.loading = await this.loadingCtrl.create({
      duration: time
    });
    this.loading.present();
  }



  async alert(message: any) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: '<h4>'+message+'</h4>',
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }




}

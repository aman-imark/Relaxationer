import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = false;

  constructor(public loadCtrl: LoadingController) { }



  async showLoader() {
    this.isLoading = true;
    return await this.loadCtrl.create({
      cssClass: "custom-loader",
      message: "Please wait...",
      // duration: 5000,
    }).then(a => {
      a.present().then(() => {
        // console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => {
            // console.log('abort presenting')
          });
        }
      });
    });
  }


  
  async hideLoader() {
    this.isLoading = false;
    return await this.loadCtrl.dismiss().then( () => {
      // console.log('dismissed');
    });
  }




}

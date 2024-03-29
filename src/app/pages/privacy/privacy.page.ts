import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpCapService } from '../../services/http-cap.service';
import { NavController, Platform, ToastController } from '@ionic/angular';

import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PrivacyPage implements OnInit {

  dym_content: any;

  constructor(private navCtrl: NavController, private router: Router,
    public toastController: ToastController, private platform: Platform,
    public capHttp: HttpCapService) { }


  ionViewWillEnter() {
    this.getPrivacyPolicyData();
  }
  
  getPrivacyPolicyData(){
      this.capHttp.getData('/privacy-policy').then((res:any) => {  // console.log(res);
        console.log(res);
        if(res.success === true){
           this.dym_content = res.data;
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }



  ngOnInit() {
  }


}

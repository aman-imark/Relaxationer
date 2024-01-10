import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpCapService } from '../../services/http-cap.service';
import { NavController, Platform, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-site-review',
  templateUrl: './site-review.page.html',
  styleUrls: ['./site-review.page.scss'],
})
export class SiteReviewPage implements OnInit {

  dym_content: any;

  constructor(private navCtrl: NavController, private router: Router,
    public toastController: ToastController, private platform: Platform,
    public capHttp: HttpCapService) { }


  ionViewWillEnter() {
    this.getSiteReviewData();
  }
  
  getSiteReviewData(){
      this.capHttp.getData('/review').then((res:any) => {  // console.log(res);
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

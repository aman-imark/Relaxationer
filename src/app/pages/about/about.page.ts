import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpCapService } from '../../services/http-cap.service';
import { NavController, Platform, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  dym_content: any;

  about : any;
  footer: any;
  offer: any;
  base_url: string;

  reviewData : any;
  review_base_url : string;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 5000,
    }
  };


  constructor(private navCtrl: NavController, private router: Router,
    public toastController: ToastController, private platform: Platform,
    public capHttp: HttpCapService) { }


  ionViewWillEnter() {
    this.getAboutData();
    this.getSiteReviewData();
  }
  


  getAboutData(){
      this.capHttp.getData('/about-us').then((res:any) => {  // console.log(res);
        console.log(res);
        if(res.success === true){
           this.dym_content = res.data;
           this.about = res.data.about;
           this.offer = res.data.offer;
           this.footer = res.data.footer[0];
           this.base_url = res.data.base_url;
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }



  getSiteReviewData(){
    this.capHttp.getData('/review').then((res:any) => {  // console.log(res);
      console.log(res);
      if(res.success === true){
         this.reviewData = res.data.review;
         this.review_base_url = res.data.base_url;
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

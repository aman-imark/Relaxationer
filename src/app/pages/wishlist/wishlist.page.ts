import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';



@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    userPlan: any;

    base_url: string;
    userWishlistData: any;



    constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
      private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
      public checkStr: SessionService, 
      public eventServ: EventService,
      public extraServ: ExtraService,
      public capHttp: HttpCapService) { }





  ionViewWillEnter(){
    this.checkLogin();
  }
  
  doRefresh(event: any) {
    setTimeout(() => {
      this.checkLogin();
      event.target.complete();
    }, 2000);
  }
  
  
  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_token = this.userData.token;
          this.getUser_WishlistData(this.user_token);
          this.getUserData();
        }else{ this.isLoggedIn = false; this.router.navigate(['/login']);}
      }else{ this.isLoggedIn = false; this.router.navigate(['/login']);}
    }).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
  }
  

  getUserData(){
    this.capHttp.getData('/user-profile', this.user_token).then((res:any) => { //  console.log(res);
      // console.log(res.data);
      if(res.success === true){
         this.userData = res.data.userData;
         this.userPlan = res.data.plan;
         console.log(this.userPlan);
      }else{
        this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
}




  getUser_WishlistData(userToken){
    this.capHttp.getData('/getFavourite', userToken).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
        this.base_url = res.base_url;
        this.userWishlistData = res.data;

      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }



  removeFrom_Wishlist(track_id){
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "remove"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
         this.getUser_WishlistData(this.user_token);
         this.eventServ.subsEvent({"subs": "active"});
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }



  goto_journeyDetailPage2(lvl_id, jrn_id){
    this.router.navigate(['journey-details2'], {queryParams : {"level_id": lvl_id, "journey_id": jrn_id} });
  }


  goto_subsriptionPlan(){
    this.router.navigate(['subscription']);
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

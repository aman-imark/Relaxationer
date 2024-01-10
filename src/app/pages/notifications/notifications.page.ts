import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';



@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    base_url: string;
    userNotificationData: any;


    constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
      private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
      public checkStr: SessionService, 
      public eventServ: EventService,
      public extraServ: ExtraService,
      public capHttp: HttpCapService) { }





  ionViewWillEnter(){
    this.checkLogin();
  }
  
  



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;
            this.getUser_NotficationData(this.user_token);
        }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
      }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
    }, (reason) => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
  }



  getUserData(){
      this.capHttp.getData('/user-profile', this.user_token).then((res:any) => {   console.log(res);
        console.log(res.data);
        if(res.success === true){
           this.userData = res.userData;
        }else{
          this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }





  getUser_NotficationData(userToken){
    this.capHttp.getData('/getNotification', userToken).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
        this.base_url = res.base_url;
        this.userNotificationData = res.data;

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

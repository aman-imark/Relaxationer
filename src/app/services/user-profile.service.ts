import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';

import { HttpCapService } from '../services/http-cap.service';
import { SessionService } from '../services/session.service';
import { EventService } from '../services/event.service';



@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    user_id: any;
   

    constructor(             
      public toastController: ToastController, private platform: Platform, 
      public capHttp: HttpCapService, 
      public checkStr: SessionService, 
      public eventServ: EventService) 
     { }

  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){
          this.userData = data;
          this.isLoggedIn = true;
              this.user_token = data.token;
             
        }else{ this.isLoggedIn = false; }
      }else{ this.isLoggedIn = false; }
    }, (reason) => {
        this.isLoggedIn = false;
    }).catch( err => {
        this.isLoggedIn = false;
    });
  }
 


  getUser(userToken){
      this.capHttp.getData('/user-profile', userToken).then((res:any) => {   console.log(res);
        console.log(res.data);
        if(res.success === true){
            return res;
        }else{
            return res;
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

}

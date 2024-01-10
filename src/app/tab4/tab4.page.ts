import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';
import { SessionService } from './../services/session.service';
import { EventService } from './../services/event.service';
import { ExtraService } from './../services/extra.service';
import { HttpCapService } from '../services/http-cap.service';
import { LoaderService } from '../services/loader.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;


    constructor(public alertCtrl: AlertController, private navCtrl: NavController, private router: Router,              
      public toastController: ToastController, private platform: Platform, 
      public checkStr: SessionService, 
      public eventServ: EventService,
      public extraServ: ExtraService,
      public capHttp: HttpCapService, private ls: LoaderService) {}




  ionViewWillEnter(){
    this.checkLogin();
  }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      // console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;
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




  goto_app_setting(){
    this.router.navigate(['app-settings']);  
  }

  goto_subsriptionPlan(){
    this.router.navigate(['subscription']);
  }


  goto_personal_history(){
    this.router.navigate(['phistory']);    
  }


  goto_about(){
    this.router.navigate(['about']);  
  }


  goto_privacy(){
    this.router.navigate(['privacy']);    
  }

  goto_terms(){
    this.router.navigate(['terms']);    
  }

  goto_contact(){
    this.router.navigate(['contact']);    
  }



  async ask_logoutConfirm(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Are you sure want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: 'Logout',
          id: 'confirm-button',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();  
  }


  logout() {
    this.checkStr.removeStore('userData');
    this.checkStr.clear();
    this.ls.showLoader();
    setTimeout(() => {
      this.ls.hideLoader();
      this.checkLogin();
      this.presentToast('Logout successfull.')
    }, 200);
  };




  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  
}

import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from './../services/session.service';
import { EventService } from './../services/event.service';
import { ExtraService } from './../services/extra.service';
import { HttpCapService } from './../services/http-cap.service';
import { LoaderService } from '../services/loader.service';

import { ModalController } from '@ionic/angular';

import { AcGiftCardPage } from '../modals/ac-gift-card/ac-gift-card.page';
import { SendGiftCardPage } from '../modals/send-gift-card/send-gift-card.page';



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    user_login_type: any;

    user_img : any;

    base_url: string;
    get_userData: any;

    favoriteCount: string;
    notificationCount: string;
    dayStreakCount: string;
    totalSessionCount: string;
    mostPlayedTrackData: any;


  constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
     private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
     public checkStr: SessionService, 
     public eventServ: EventService,
     public extraServ: ExtraService,
     public capHttp: HttpCapService, private ls: LoaderService) 
     
    {
      this.eventPublish_subs(); 
    }
     

  // subscribe to event 
  eventPublish_subs(){
    this.eventServ.subs_Event.subscribe((data: any) => {
      console.log("Tab1 Subs: " + data);
      if(data.subs){
        this.checkLogin();
      }else{ }
      //  console.log('user#:   '+ this.user_role +'   '+ this.isLoggedIn);    
    }); 
  } 


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
        // console.log(data);
        if(data != null || data != '' || typeof(data) != 'undefined'){
          if(data.token){          
            this.isLoggedIn = true;
              this.user_token = data.token;
              this.user_login_type = data.login_type;
              this.getUser_ProfileData(this.user_token);
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
  




    getUser_ProfileData(userToken){
      this.capHttp.getData('/user-profile', userToken).then((res:any) => {   console.log(res);
        console.log(res.data);
        if(res.success === true){
          this.base_url = res.data.base_url;
          this.get_userData = res.data.userData;
          this.favoriteCount = res.data.favorite;
          this.notificationCount = res.data.notification_count;
          this.dayStreakCount = res.data.day_streak_count;
          this.totalSessionCount = res.data.session_count;
          this.mostPlayedTrackData =  res.data.trackData;
        //   {
        //     "userData": {
        //         "id": 47,
        //         "name": "sandeep gour",
        //         "email": "sandeep.gour124653@gmail.com",
        //         "email_verified": false,
        //         "plan_id": 0,
        //         "plan_type": "basic",
        //         "avatar": "https://relaxationer.com/storage/users/default.png"
        //     },
        //     "favorite": 0,
        //     "day_streak_count": 0,
        //     "trackData": [],
        //     "session_count": 0,
        //     "notification_count": 0
        // }
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }





  async profilePic_changeClick(){
    const actionSheet = await this.acSheetCtrl.create({
      header: 'Update Profile Image',
      cssClass: 'custom-sheet',
      mode: 'md',
      buttons: [{
        text: 'Select from gallery',
        icon: 'images-outline',
        handler: () => { 
          // this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },{
        text: 'Use camera',
        icon: 'camera-outline',
        handler: () => { 
          // this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },{ 
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }







  async activateGiiftCard_ModalOpen(){
    // const popover = await this.popoverCtrl.create({  
    //   component: AcGiftCardPage,  
    //   event: ev,  
    //   animated: true,  
    //   showBackdrop: true,
    //   backdropDismiss:true,
    //   size: "cover",
    //   alignment: "center",
    // });  
    // return await popover.present();  
    const modal = await this.modalCtrl.create({  
      component: AcGiftCardPage, 
      cssClass: 'custom-modal',
      mode: 'md', 
      animated: true,  
      showBackdrop: true,
      breakpoints: [0, 0.6, 1],
      initialBreakpoint: 1,
      backdropDismiss:true ,
    });  
    return await modal.present();  
  }


  async sendGiift_ModalOpen(){
    // const popover = await this.popoverCtrl.create({  
    //   component: SendGiftCardPage,  
    //   event: ev,  
    //   animated: true,  
    //   showBackdrop: true,
    //   backdropDismiss:true ,
    //   size: "cover",
    //   alignment: "center",
    // });  
    // return await popover.present();  

    const modal = await this.modalCtrl.create({  
      component: SendGiftCardPage,  
      animated: true,  
      cssClass: 'custom-modal',
      mode: 'md', 
      showBackdrop: true,
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 1,
      backdropDismiss:true,
    });  
    return await modal.present();  
  }







  goto_wishlist(){
    this.router.navigate(['wishlist']);    
  }


  goto_notification(){
    this.router.navigate(['notifications']);  
  }


  goto_subsriptionPlan(){
    this.router.navigate(['subscription']);
  }


  goto_updateProfile(){
    this.router.navigate(['update-profile']);
  }



  goto_updatePassword(){
    this.router.navigate(['update-password']);
  }







  async logout_Confirmation(){
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

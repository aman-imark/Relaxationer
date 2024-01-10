import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';

import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-ac-gift-card',
  templateUrl: './ac-gift-card.page.html',
  styleUrls: ['./ac-gift-card.page.scss'],
})
export class AcGiftCardPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    user_id: any;
    user_name: any;
    user_email: any;
    is_email_verified: any;
    user_plan_id: any;
 


    base_url: string;
  
    giftCardData : any;
    for_giftCard = 'my_friend';
    getGiftCard: boolean = true;

    abForm: FormGroup;
    submitted: boolean = false;

    constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
      private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController, private ls: LoaderService,
      public checkStr: SessionService, 
      public eventServ: EventService,
      public extraServ: ExtraService,
      public capHttp: HttpCapService,  private formBuilder: FormBuilder) { }




  ngOnInit(): void {
    this.abForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      code: ["", [Validators.required, Validators.minLength(4)]]
    });
  }





  ionViewWillEnter(){
    this.checkLogin();
  }
  



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_id = this.userData.id;
          this.user_token = this.userData.token;
          this.getGiftCard_data();
        }else{ this.isLoggedIn = false;  this.router.navigate(['/login']);}
      }else{ this.isLoggedIn = false;  this.router.navigate(['/login']);}
    },(reason) => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    }
    ).catch( err => {
        this.isLoggedIn = false;
        this.router.navigate(['/login']);
    });
  }




  getGiftCard_data(){
    this.capHttp.getData('/gift-card').then((res:any) => {   console.log(res);
      console.log(res.data);
      if(res.success === true){
        this.base_url = res.data.base_url;
        this.giftCardData = res.data.banner[0];
        console.log(this.giftCardData);
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }





  activateFGiftCard_Form(){
    this.submitted = true;
    console.log(this.abForm.value)

    if(this.abForm.status === "INVALID"){
    }else if(this.abForm.status === "VALID"){
      this.ls.showLoader();
      this.capHttp.postData('/post-gift-card', this.abForm.value, this.user_token).then((res:any) => {  // console.log(res);
        this.ls.hideLoader();
        if(res.success === true){ 
            this.presentToast(res.message);
        }else{
          if(res.message){
            this.extraServ.alert(res.message);
          }
        }      
      }).catch( err => {
      });
    }else{
      // this.presentToast('Please fill form correctlly!');
    }
  }







  dismiss() {
    // this.returnSortValue = {'sort': this.mwsortValue};
    this.modalCtrl.dismiss();
    // this.popCtrl.dismiss({'dismissed': true});
  }
 

  async presentToast(message: any) {
   const toast = await this.toastController.create({
     message: message,
     duration: 3000
   });
   toast.present();
  }



}

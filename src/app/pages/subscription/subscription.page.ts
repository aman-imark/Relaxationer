import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ToastController, IonContent, Platform } from '@ionic/angular';
import { Location } from "@angular/common";

import { NavController, AlertController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';




@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    
  base_url: string;
  planDetails: any;
  subscriptionData: any;
  subscriptionDataA: any;
  subscriptionDataB: any;
  subscriptionDataC: any;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    spaceBetween: 25,
    pager: true
  };


  


  constructor(public toastController: ToastController,private location: Location, public alertController: AlertController, 
    private router: Router, public capHttp: HttpCapService,
    public extra : ExtraService, public checkStr: SessionService,
    public activatedRoute : ActivatedRoute, public eventServ: EventService,
    private navCtrl: NavController, private platform: Platform) 
    

    { this.eventPublish_subs(); }


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




  ngOnInit() {
    // this.extra.autoHide(500);
    // this.checkLogin();
  }
  

  ionViewWillEnter(){
    this.extra.autoHide(500);
    this.checkLogin();
  }




  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => {   
      console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;
            this.getSubscriptionPlans(this.user_token);
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


  getSubscriptionPlans(userToken){
    this.capHttp.getData('/subscription', userToken).then((res:any) => {  // console.log(res);
      console.log(res);
      if(res.success === true){
        this.base_url = res.data.base_url;
        this.planDetails = res.data.our_plan[0];
        
        this.subscriptionData = res.data.subscription;

        this.subscriptionDataA = res.data.subscription[0];
        this.subscriptionDataB = res.data.subscription[1];
        this.subscriptionDataC = res.data.subscription[2];

      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }



  get_subscriptionPlan(plan_id, title, subs_type, plan_amount){
    console.log(plan_id, title, subs_type, plan_amount)
    this.router.navigate(['payment-method'], { queryParams: { plan_type: 'subs', plan_id: plan_id, amount: plan_amount, plan_title: title, 
                                                              subs_type: subs_type, fname: '', femail: ''}});
  }


  
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}

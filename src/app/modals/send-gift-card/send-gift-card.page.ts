import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';

import { ModalController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

import { IonTextarea } from '@ionic/angular';


@Component({
  selector: 'app-send-gift-card',
  templateUrl: './send-gift-card.page.html',
  styleUrls: ['./send-gift-card.page.scss'],
})
export class SendGiftCardPage implements OnInit {
  @ViewChild('myTextArea') private textArea: IonTextarea;

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    user_email: any;
    is_email_verified: any;


    giftCardData : any;
    yearlyGift: any;
    lifetimeGift: any;
    selectedGift: string;

    abForm: FormGroup;
    submitted: boolean = false;

  constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
     private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
     public checkStr: SessionService, 
     public eventServ: EventService,
     public extraServ: ExtraService,
     public capHttp: HttpCapService,  private formBuilder: FormBuilder) { }




  ngOnInit(): void {
    this.abForm = this.formBuilder.group({
      selectedGift: ["", [Validators.required,]],
      fname: ["", [Validators.required, Validators.minLength(4)]],
      femail: ["", [Validators.required, Validators.email]],
      fmessage: ["", [Validators.required, Validators.minLength(4)]]
    });
  }



  // gift_price: "89.99"
  // gift_type: "yearly"
  // id: 1

//   {card_id: 1, fname: "ewrwe", femail: "sku@gmail.com", fmessage: "ewet87 wy87werrh wr wr wer wero ereo8 oerur yoerr 3 3 3r r erg erg erg "}

//   {
//     "plan_id":1,
//     "amount":500.00,
//     "stripeToken":"",
//     "plan_title":"basic plan",
//     "plan_type":"gift",
//     "subs_type":"montly",
//     "fname":"friend@gmail.com",
//     "femail":"9874563210"
// }






  ionViewWillEnter(){
    this.checkLogin();
    this.textArea.ionChange.subscribe(()=>{
      this.textArea.autoGrow = true;
      });
  }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_token = this.userData.token;
          this.getGiftCard_data();
        }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
      }else{ this.isLoggedIn = false; this.router.navigate(['/login']);}
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
    this.capHttp.getData('/gift-this').then((res:any) => {   console.log(res);
      console.log(res.data);
      if(res.success === true){
        this.giftCardData = res.data;
        this.yearlyGift =  res.data[0];
        this.lifetimeGift = res.data[1];

        this.selectedGift = this.yearlyGift.id+'/'+this.yearlyGift.gift_price+'/'+this.yearlyGift.gift_type;
        console.log(this.selectedGift);
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }




  sendFGiftCard_Form(){
    this.abForm.controls['selectedGift'].setValue(this.selectedGift);


    this.submitted = true;
    console.log(this.abForm.value)

    if(this.abForm.status === "INVALID"){
    }else if(this.abForm.status === "VALID"){

      console.log(this.abForm.value.selectedGift)
       let selected = this.abForm.value.selectedGift.split("/");
       console.log(selected)
         this.get_subscriptionPlan(selected[0], selected[1], selected[2], this.abForm.value.fname,
                                   this.abForm.value.femail, this.abForm.value.fmessage);
                                   this.modalCtrl.dismiss();
    }else{
      // this.presentToast('Please fill form correctlly!');
    }
  }




  get_subscriptionPlan(plan_id, plan_amount, title, fname, femail, fmessage){
    // console.log(plan_id, plan_amount, title, fname, femail, fmessage);
    this.router.navigate(['payment-method'], { queryParams: { plan_type: 'gift', plan_id: plan_id, amount: plan_amount, plan_title: title, 
                                                              subs_type: title, fname: fname, femail: femail}});
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

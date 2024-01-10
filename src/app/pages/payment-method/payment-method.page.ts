import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';

import { Stripe } from '@awesome-cordova-plugins/stripe/ngx';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MonthYearPage } from '../../modals/month-year/month-year.page';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.page.html',
  styleUrls: ['./payment-method.page.scss'],
})
export class PaymentMethodPage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;


    stripe_mode: string = 'sandbox';
    stripe_publishablekey: string = 'pk_test_51JkiTGAl7r5iUW2lyagEGG9k4GLGVg7Kpqe7vs5OxmOJM82V56KG3vAA7ipoTwHHdBrUrAvw4spYViTwYQ0tQuDf00QFDquf0f';
    stripe_secretkey: string = 'sk_test_51JD0UeSIAoSvakcdXdX2LbRhpk1pR8gKnL2TbGsYdMqEbxdVJrQRWxIb5IzqD98GDqALt9guCwR4q9Cb8ongYQlu00GjeLhuut';
    get_stripeToken: any;

    card_number: string;
    card_holder_name;
    card_exp_month;
    card_exp_year;
    through_dateValue;
    split_MM_YYYY: any;
    ccv_value: any;


    base_url: string;
    userNotificationData: any;


    cardPayForm: FormGroup;
    submitted: boolean = false;

    pay_plan_type: any;
    pay_plan_id: any;
    pay_plan_title: any;
    pay_amount: any;
    pay_subs_type: any;
    pay_fname: any;
    pay_femail: any;

    
    successCard: boolean = false;
    today = new Date();


    constructor(public modalCtrl: ModalController, public toastController: ToastController, private router: Router,
      private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController, private stripe: Stripe, 
      public checkStr: SessionService, public activatedRoute : ActivatedRoute, private formbuilder: FormBuilder,
      public eventServ: EventService,
      public extraServ: ExtraService,
      public capHttp: HttpCapService, private ls: LoaderService) { }




  ngOnInit() {
    this.cardPayForm = this.formbuilder.group({
      number: [null, [Validators.required, Validators.minLength(16)]],
      name: [null, Validators.required],
      expMonth: [null, [Validators.required]],
      expYear: [null, [Validators.required]],
      cvc: [null, [Validators.required, Validators.minLength(3)]],
    });
  }





  ionViewWillEnter(){
    this.activatedRoute.queryParamMap.subscribe((params: any)=>{  console.log(params);
      this.pay_plan_type = params.params.plan_type;
      this.pay_plan_id = params.params.plan_id;
      this.pay_plan_title = params.params.plan_title;
      this.pay_amount = params.params.amount;
      this.pay_subs_type = params.params.subs_type;
      this.pay_fname = params.params.fname;
      this.pay_femail = params.params.femail;
    });
    this.checkLogin();
  }
  
  
  
  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_token = this.userData.token;
          // this.getUser_NotficationData(this.user_token);
          this.stripe.setPublishableKey(this.stripe_publishablekey).then((res :any) => { console.log(res)
          },err => {
          }).catch(error => { });
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
  

  async openThroghMY_Modal(){
    const modal = await this.modalCtrl.create({
      component: MonthYearPage,
      animated: true,  
      cssClass: 'custom-modal',
      mode: 'md', 
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1],
      backdropDismiss:false
      });

      modal.onDidDismiss().then((data) => {
        // console.log(data.data);
        this.through_dateValue = data.data.exp;
        this.split_MM_YYYY = this.through_dateValue.split('/');
        this.card_exp_month = this.split_MM_YYYY[0];
        this.card_exp_year = this.split_MM_YYYY[1];
      });
      return await modal.present();
  }
  

  countChange(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]*/g, '');
    // event.target.value = event.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
  }
  

  get f() {
    return this.cardPayForm.controls;
  }


  user_Make_Payment(form: FormGroup){
    this.submitted = true;
    console.log(form)
    console.log('Valid?', form.valid); // true or false
    // console.log(form.value);
      if(form.valid === true){
        this.ls.showLoader();
        if(this.stripe_publishablekey){
          let card = {
            number: form.value.number,
            expMonth: form.value.expMonth,
            expYear: form.value.expYear,
            cvc: form.value.cvc
          };
          this.stripe.createCardToken(card).then((token :any) => { 
            console.log(token);

            // {
            //   "card": {
            //       "brand": "Visa",
            //       "exp_month": 3,
            //       "exp_year": 2025,
            //       "funding": "credit",
            //       "last4": "4242"
            //   },
            //   "id": "tok_1MZuUIAl7r5iUW2l4gFu85pw",
            //   "created": "Fri Feb 10 16:39:54 GMT+05:30 2023",
            //   "type": "card"
            // }

       

            if(token.id){
              let payMethod_Data = {
                plan_type: this.pay_plan_type,
                plan_id: this.pay_plan_id,
                plan_title: this.pay_plan_title,
                amount: this.pay_amount,
                subs_type: this.pay_subs_type,
                fname: this.pay_fname,
                femail: this.pay_femail,
                stripeToken: this.get_stripeToken
              }
              console.log(payMethod_Data);
              this.get_stripeToken = token.id;

              if(this.get_stripeToken && this.pay_plan_type && this.pay_plan_id
                 && this.pay_amount && this.pay_subs_type){
                 this.makeProduct_FinalPayment(payMethod_Data);
              }else{
                 this.presentToast('Payment Failed: after Stripe token error!');
              }
              //  {
               //   "card": {
               //       "brand": "Visa",
               //       "exp_month": 5,
               //       "exp_year": 2024,
               //       "funding": "credit",
               //       "last4": "4242"
               //   },
               //   "id": "tok_1KrgR1AldTLhvutWx8p6Wtjx",
               //   "created": "Sat Apr 23 16:13:27 GMT+05:30 2022",
               //   "type": "card"
              // }
            }else{
             this.presentToast('Error! Stripe Payment Token not found.');
            }
          }).catch(error => {
              this.presentToast(error); //  console.error(error) 
          });
        }else{
          this.presentToast('Stripe publishable key not found!');
        }
      }else if(form.valid === false){
      }else{
        this.presentToast('Card form valid error else!');
      }
  }





  // product complete or final payment and redirect
  makeProduct_FinalPayment(payMethod_Data){

    console.log(payMethod_Data);
  //   {
  //     "plan_id": "2",
  //     "amount": "8.88",
  //     "stripeToken": "tok_1LI9IeSIAoSvakcdUSInlwIO",
  //     "plan_title": "Most Popular",
  //     "plan_type": "subs",
  //     "subs_type": "yearly",
  //     "fname": "",
  //     "femail": ""
  //  }

    this.capHttp.postData('/payment/checkout', payMethod_Data, this.user_token).then((res:any) => {  
       console.log(res);
       if(res.success === true){
          this.successCard = true;
          this.eventServ.subsEvent({"subs": "active"});
       }
    }).catch( err => {
      console.log(err)
    });
  }



  // getUser_NotficationData(userToken){
  //   this.capHttp.getData('/getNotification', userToken).then((res:any) => {   console.log(res);
  //     // console.log(res.data);
  //     if(res.success === true){
  //       this.base_url = res.base_url;
  //       this.userNotificationData = res.data;

  //     }else{
  //        this.presentToast(res.message);
  //     }
  //   }).catch( err => {
  //     // alert(JSON.stringify(err));
  //   });
  // }





  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  


}

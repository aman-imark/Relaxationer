import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { ToastController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { ModalController } from '@ionic/angular';
import { HttpCapService } from '../../services/http-cap.service';
import { SessionService } from '../../services/session.service';
import { ExtraService } from '../../services/extra.service';
import { IonTextarea } from '@ionic/angular';




@Component({
  selector: 'app-rate-review',
  templateUrl: './rate-review.page.html',
  styleUrls: ['./rate-review.page.scss'],
})
export class RateReviewPage implements OnInit {
  @ViewChild('myTextArea') private textArea: IonTextarea;

  @Input() journey_id;
  @Input() journey_level_id;


  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    user_id: any;
    user_name: any;
    user_email: any;
    is_email_verified: any;
    user_plan_id: any;

  rvwForm: FormGroup;
  submitted: boolean = false;

  posted: boolean = false;
  sendData;

  initRating: number = 0;

  constructor(public modalCtrl: ModalController, public capHttp: HttpCapService, private router: Router, 
              public toastController: ToastController, private formBuilder: FormBuilder,
              public extra : ExtraService, public checkStr: SessionService) { }


  ngOnInit(): void {
    console.log(this.journey_id);
    console.log(this.journey_level_id);

    this.rvwForm = this.formBuilder.group({
      journey_id: ["1", [Validators.required]],
      journey_level_id: ["1", [Validators.required]],
      rating: [0, [Validators.required]],
      description: [""],
    });
  }
  


  ionViewWillEnter(){
    this.checkLogin();
    this.textArea.ionChange.subscribe(()=>{
      this.textArea.autoGrow = true;
      });
  }



  checkLogin(){
    this.checkStr.getStore('userData').then((data:any) => { 
      // console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        this.userData = data;
        if(this.userData.token){
          this.isLoggedIn = true;
          this.user_id = this.userData.id;
          this.user_token = this.userData.token
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



  


  get f() {
    return this.rvwForm.controls;
  }



  // "journey_id":"1",
  // "journey_level_id":"1",
  // "rating":"5",
  // "description":"voice is good!"

  submitRating(){
    this.rvwForm.controls['journey_id'].setValue(this.journey_id);
    this.rvwForm.controls['journey_level_id'].setValue(this.journey_level_id);
    this.submitted = true;
    console.log(this.rvwForm.value);

    if(this.rvwForm.status === "VALID"){
      this.extra.show();
      this.capHttp.postData('/postJourneyReview', this.rvwForm.value, this.user_token).then((res:any) => {  // console.log(res);
        console.log(res);
        this.extra.hide();
        if(res.success === true){ 
          this.posted = true;
          this.dismiss();
        }else{
          if(res.message){
            this.extra.alert(res.message);
          }
        }    
      }).catch( err => {
      });
    }else{
      // this.presentToast('Please fill form correctlly!');
    }
  }

  ratingChanged($event){
    console.log($event);
    let rate = $event;
    this.rvwForm.controls['rating'].setValue(rate);

  }


  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


  dismiss() {
    this.sendData = {'posted': this.posted};
    this.modalCtrl.dismiss(this.sendData);
  } 


}

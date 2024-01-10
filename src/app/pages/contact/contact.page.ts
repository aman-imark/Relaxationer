import { Component, OnInit, ViewChild } from '@angular/core';


import { Router } from '@angular/router';

import { HttpCapService } from '../../services/http-cap.service';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { FormControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  @ViewChild('myTextArea') private textArea: IonTextarea;

  dym_content: any;
  contactUs: any;
  footer: any;

  thanks_active = false;
  fb_link: any;
  tw_link: any;
  insta_link: any;


  contactForm: FormGroup;
  submitted: boolean = false;


  constructor(private navCtrl: NavController, private router: Router,
    public toastController: ToastController, private platform: Platform,
    public capHttp: HttpCapService, private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      fullname: ["", [Validators.minLength(5), Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      message: ["", [Validators.minLength(5), Validators.required]]
    });
  }

  
  ionViewWillEnter(){
    this.getContactUsData();
    this.textArea.ionChange.subscribe(()=>{
      this.textArea.autoGrow = true;
      });
  }

  get formControl() {
    return this.contactForm.controls;
  }






  getContactUsData(){
      this.capHttp.getData('/contact-us').then((res:any) => {  // console.log(res);
        console.log(res);
        if(res.success === true){
           this.dym_content = res.data;
           this.contactUs = res.data.contactUs[0];
           this.footer = res.data.footer[0];
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }




  contact_usForm(){
    this.submitted = true;
    console.log(this.contactForm.value)
    if(this.contactForm.status === "INVALID"){
      //  this.presentToast('Please fill form correctlly!');
    }else if(this.contactForm.status === "VALID"){
      this.capHttp.postData('/contact-us', this.contactForm.value).then((res:any) => {  // console.log(res);
        console.log(res);
        if(res.success === true){
            this.thanks_active = true;
            this.presentToast(res.message);
        }else{
            this.thanks_active = false;
            this.presentToast(res.message);
        }    
      }).catch( err => {
      });
    }else{
      this.presentToast('Please fill form correctlly!')
    }
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }




}

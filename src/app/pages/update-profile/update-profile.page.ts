import { Component, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { LoaderService } from 'src/app/services/loader.service';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

import { DateMonthYearPage } from '../../modals/date-month-year/date-month-year.page';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {

  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;

    user_name: any;
    user_email: any;
    is_email_verified: any;
    user_img : any;

    base_url: string;
    get_userData: any;
 

  updatePROFILEForm: FormGroup;
  submitted: boolean = false;


   dateOfBirth: string;


  constructor(public toastController: ToastController, private router: Router, private camera: Camera,
    private alertCtrl: AlertController, public acSheetCtrl: ActionSheetController,
    public checkStr: SessionService, 
    public eventServ: EventService,
    public extraServ: ExtraService, private ls: LoaderService,
    public capHttp: HttpCapService, private formBuilder: FormBuilder, public modalCtrl: ModalController) { }





  ngOnInit(): void {
    this.updatePROFILEForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.email, Validators.required]],
      dob: ["", [Validators.required]],
      avatar: [""]
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
          this.user_token = this.userData.token;
          this.getUser_ProfileData(this.user_token);
        }else{ this.isLoggedIn = false; this.router.navigate(['/login']);}
      }else{ this.isLoggedIn = false; this.router.navigate(['/login']); }
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
          this.user_img = res.data.userData.avatar;
            let dob = new Date(res.data.userData.dob).toISOString();
           
          this.dateOfBirth = dob;
          console.log(this.dateOfBirth)

          this.updatePROFILEForm.controls['name'].setValue(res.data.userData.name);
          this.updatePROFILEForm.controls['email'].setValue(res.data.userData.email);
          this.updatePROFILEForm.controls['dob'].setValue(res.data.userData.dob);
          this.updatePROFILEForm.controls['avatar'].setValue('');
    
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





  get f() {
    return this.updatePROFILEForm.controls;
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
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          // this.takePicture(CameraSource.Photos);
          // this.presentToast('Photo Library Permission is disabled!')
        }
      },{
        text: 'Use camera',
        icon: 'camera-outline',
        handler: () => { 
          this.takePicture(this.camera.PictureSourceType.CAMERA);
          // this.takePicture(CameraSource.Camera);
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




  // takePicture(sourceType: any){
  //   Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     // resultType: CameraResultType.DataUrl,
  //     resultType: CameraResultType.Uri,
  //     source: sourceType,
  //   }).then(async (res) => {
  //     console.log(res);
  //       let imgFormat = res.format;
  //       let imgPath = res.webPath;
  //       console.log(imgPath)
  //       if(imgPath){
  //         this.user_img = imgPath;
  //         const file = await Filesystem.readFile({
  //             path: imgPath,
  //         });
  //         console.log(file);
  //         // this.updatePROFILEForm.controls['avatar'].setValue('data:image/'+imgFormat+';base64,'+file.data);
  //         console.log(this.updatePROFILEForm.value);
  //       }
  //  })
  // };



  takePicture(sourceType: any){
    const options: CameraOptions = {
      quality: 90,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // console.log(imageData)
      if(imageData){
        let base64String = imageData;
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        this.user_img = base64Image;
        this.updatePROFILEForm.controls['avatar'].setValue(base64Image);
        console.log(this.updatePROFILEForm.value);
      }
    },(err) => {
        this.presentToast(err);
    });
  };


  async selectDate_ModalOpen(){
    const modal = await this.modalCtrl.create({
      component: DateMonthYearPage,
      animated: true,  
      cssClass: 'custom-modal',
      mode: 'md', 
      initialBreakpoint: 0.7,
      breakpoints: [0, 0.7, 1],
      backdropDismiss:false
      // componentProps: {
      //     'pass_date': '2000-06-29'
      //    }
      });

      modal.onDidDismiss().then((data) => {
        console.log(data.data);
        console.log(data.data.dob);
        // {
        //   "dob": "2022-07-04"
        // }

        if(data.data.dob){
          this.updatePROFILEForm.controls['dob'].setValue(data.data.dob);
        }

      });
      return await modal.present();
  }


 
  selectDate(val: any){
    console.log(val)
    const formatted_DOB = moment(val).format('YYYY-MM-DD');
    console.log(formatted_DOB); 
    this.dateOfBirth = moment(val).format('YYYY-MM-DD');
  }


  update_userProfile(){
      this.submitted = true;
      console.log(this.updatePROFILEForm.value)
      console.log(this.updatePROFILEForm.controls['dob'].value)
      if(this.updatePROFILEForm.status === "INVALID"){
        if(!this.updatePROFILEForm.controls['dob'].value){
            this.presentToast('Failed, Please add an DOB also!');
        }
      }else if(this.updatePROFILEForm.status === "VALID"){
        this.ls.showLoader();
        this.capHttp.postData('/update-profile', this.updatePROFILEForm.value, this.user_token).then((res:any) => {  // console.log(res);
          console.log(res);
          this.ls.hideLoader();
          if(res.success === true){ 
              // let userData = {
              //   "login_type": "email",
              //   "token": res.data.token
              // }
              // this.checkStr.setStore('userData', userData);
              // this.router.navigate(['/maintabs/tabs/tab1']);
              this.eventServ.subsEvent({"subs": "active"});
              this.presentToast(res.message);
              this.router.navigate(['/maintabs/tabs/tab2']);



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




  
  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      mode: 'md',
      duration: 2000
    });
    toast.present();
  }


}

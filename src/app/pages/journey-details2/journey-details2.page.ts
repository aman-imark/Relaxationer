import { Component, OnInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { NavController, Platform, isPlatform, ToastController, AlertController } from '@ionic/angular';
import { SessionService } from '../../services/session.service';
import { EventService } from '../../services/event.service';
import { ExtraService } from '../../services/extra.service';
import { HttpCapService } from '../../services/http-cap.service';


import { RateReviewPage } from '../../modals/rate-review/rate-review.page';
import { IonicSlides, IonSlides, IonSlide } from '@ionic/angular';
import { Share } from '@capacitor/share';


import { ModalController } from '@ionic/angular';
import { MusicJourneyPage } from '../../modals/music-journey/music-journey.page';




@Component({
  selector: 'app-journey-details2',
  templateUrl: './journey-details2.page.html',
  styleUrls: ['./journey-details2.page.scss'],
})
export class JourneyDetails2Page implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;  


  isLoggedIn: boolean = false;
  userData: any;
    user_token: any;
    userPlan: any;

  base_url: string;
  allLevelData: any;
  journey_level_id: any;
  progressBar: number;
  currentJourneyData: any;
  nextData: any;
  prevData: any;
  levelData: any;


  journeyReviewData: any[];

  userWishlistData: any;

  segmentLevel: any = [];
  selectedSegLevel: number = 0;


  slideConfig = {
    centeredSlides: true,
    autoHeight: true
  };
  isReadMore = true

  route_level_title: string;
  route_level_id : number;
  route_journey_id : number;

  tt = 'https://picsum.photos/200';

  constructor(private navCtrl: NavController, private router: Router,  public activatedRoute : ActivatedRoute,
    public toastController: ToastController, private platform: Platform, public modalCtrl: ModalController,
    public checkStr: SessionService, 
    public eventServ: EventService,
    public extraServ: ExtraService,
    public capHttp: HttpCapService) 
    
    { 
      this.activatedRoute.queryParams.subscribe((res: any)=>{
       console.log(res);
          this.route_level_title = res.level_text;
          this.route_level_id = res.level_id;
          this.route_journey_id = res.journey_id;
       });
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


  ngOnInit() {
  }

  

  ionViewWillEnter() {
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
      console.log(data);
      if(data != null || data != '' || typeof(data) != 'undefined'){
        if(data.token){          
          this.isLoggedIn = true;
            this.user_token = data.token;
            this.getJourney_DetailData(this.user_token);
            this.getJourney_ReviewData(this.user_token);
            this.getUserData();
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
      this.capHttp.getData('/user-profile', this.user_token).then((res:any) => {  // console.log(res);
        console.log(res.data);
        if(res.success === true){
           this.userData = res.data.userData;
           this.userPlan = res.data.plan;
           console.log(this.userPlan);
       
        }else{
          this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });
  }




  showText() {
    this.isReadMore = !this.isReadMore
  }




  //{ evel_id: "1", journey_id: "5"}
  getJourney_DetailData(userToken){
    console.log(userToken);
    console.log(this.route_level_id);
    console.log(this.route_journey_id);

      this.capHttp.postData('/getJourneyDetails', {"journey_id": this.route_level_id, "journey_level_id": this.route_journey_id}, userToken).then((res:any) => {  // console.log(res);
        console.log(res);
        if(res.success === true){
          this.base_url = res.data.base_url;
          this.allLevelData = res.data.allLevel;
          this.journey_level_id = res.data.journey_level_id;
          this.progressBar = res.data.progress;
          this.currentJourneyData = res.data.journey[0];  
        }else{
           this.presentToast(res.message);
        }
      }).catch( err => {
        // alert(JSON.stringify(err));
      });

  }





  // {level_id: "1", journey_id: "5"}
  getJourney_ReviewData(userToken){
     this.capHttp.postData('/getJourneyReview', {"journey_id": this.route_level_id, "journey_level_id": this.route_journey_id}, userToken).then((res:any) => {  // console.log(res);
       console.log(res);
       if(res.success === true){
         this.journeyReviewData = res.data;
       }else{
          this.presentToast(res.message);
       }
     }).catch( err => {
       // alert(JSON.stringify(err));
     });   
  }






  addTo_Wishlist(track_id){
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "add"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
        this.getJourney_DetailData(this.user_token);
        // this.getJourney_ReviewData(this.user_token);
        this.eventServ.subsEvent({"subs": "active"});
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }





  removeFrom_Wishlist(track_id){
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "remove"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
        this.getJourney_DetailData(this.user_token);
        // this.eventServ.subsEvent({"subs": "active"});
        // this.getJourney_ReviewData(this.user_token);
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }

  


  async playJourney_Music(statusPlay, song_type, bg_img, song_id, song_tilte, song_durr, song_fav, song_name, song_download){
    // console.log(bg_img, song_id, song_tilte, song_durr, song_fav, song_name, song_download);

    console.log(statusPlay + song_type);
    if(statusPlay == 'yes'){
    const modal = await this.modalCtrl.create({
      component: MusicJourneyPage,
      animated: true,  
      cssClass: 'song-modal',
      mode: 'md', 
      initialBreakpoint: 1,
      breakpoints: [0, 1, 1],
      backdropDismiss:false,
      componentProps: { user_token: this.user_token, bg_img: bg_img, song_id: song_id, song_tilte: song_tilte, 
                        song_durr: song_durr, song_fav: song_fav, song_name: song_name, song_download: song_download }
      });

      modal.onDidDismiss().then((data) => {
        console.log(data.data);
        // {"sort" : "relevance"}
      });
      return await modal.present();
    }else if(statusPlay == 'no'){
      this.songStatusToast('Please complete your previous journey to listen this track.')
    }else{
      this.presentToast('Play status is missing!');
    }
  }




  async shareJourney(){
    await Share.share({
      title: 'The best program for deep relaxation.',
      text: "We're here to help you live a better, healthier life. Meditation & self care. Mind, body & soul.",
      url: 'https://relaxationer.com',
      dialogTitle: 'Share with buddies',
    });
  }



  async addNew_Review(){
    const modal = await this.modalCtrl.create({
      component: RateReviewPage,
      mode: 'md',
      cssClass: 'custom-modal',
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 1],
      componentProps: { journey_id: this.route_level_id, journey_level_id: this.route_journey_id },
      backdropDismiss:false
      });

      modal.onDidDismiss().then((data) => {
        console.log(data);
        if(data.data){
          if(data.data.posted === true){
            this.getJourney_ReviewData(this.user_token);
          }
        }
      });
      return await modal.present();
  }




       
  goto_subsriptionPlan(){           
    this.router.navigate(['subscription']);
  }

  download_JourneySong(){
    // this.presentToast("cap_plugin err found!");
  }

  
  async songStatusToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      mode: 'md',
      icon: 'lock-closed',
      position: 'bottom',
    });
    toast.present();
  }




  async subsToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      icon: 'lock-closed',
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'Go to Subscription',
          handler: () => {
            console.log('Subscription clicked');
            this.goto_subsriptionPlan();
          }
        }
      ]
    });
    toast.present();
  }



  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}

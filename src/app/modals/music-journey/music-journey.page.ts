// import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';

import { NavParams, IonRange, ActionSheetController, NavController, Platform } from '@ionic/angular';

import { ModalController, ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import { Share } from '@capacitor/share';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, HttpResponse, HttpOptions } from '@capacitor-community/http';

import { EventService } from '../../services/event.service';
import { HttpCapService } from '../../services/http-cap.service';


import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';





@Component({
  selector: 'app-music-journey',
  templateUrl: './music-journey.page.html',
  styleUrls: ['./music-journey.page.scss'],
})



export class MusicJourneyPage implements OnInit, OnDestroy{
  @Input() user_token;
  @Input() bg_img;
  @Input() song_id;
  @Input() song_tilte;
  @Input() song_durr;
  @Input() song_fav;
  @Input() song_name;
  @Input() song_download;

  duration: any = -1;
  curr_playing_file: MediaObject;
  storageDirectory: any;

  play_song_id: string = "";
  play_The_track: string = "";
  
  position: any = 0;
  get_position_interval: any;
  is_playing = false;


  is_in_play = false;


  is_ready = false;
  get_duration_interval: any;
  display_position: any = '00:00';
  display_duration: any = '00:00';




  constructor(public modalCtrl: ModalController, private media: Media, private platform: Platform, public eventServ: EventService,
              public capHttp: HttpCapService, private httpNg: HttpClient, private vibration: Vibration,
              public actionCtrl: ActionSheetController, public toastController: ToastController) 


  {  }



  ngOnInit() {
    // console.log(this.user_token);
    // console.log(this.bg_img);
    // console.log(this.song_id);
    // console.log(this.song_tilte);
    // console.log(this.song_durr);
    // console.log(this.song_fav);
    // console.log(this.song_name);
    // console.log(this.song_download);

    this.prepareAudioFile();
  }




  prepareAudioFile() {
    this.platform.ready().then((res) => {
      this.play_The_track = this.song_download;
      // this.curr_playing_file = this.media.create(this.play_The_track);

      // const file: MediaObject = this.media.create(this.play_The_track);

      this.getDuration();
    });
  }




  getDuration() {
    // this.play_The_track = this.song_download;
    this.curr_playing_file = this.media.create(this.play_The_track);

    // on occassions, the plugin only gives duration of the file if the file is played
    // at least once

    this.curr_playing_file.play();


    // this.curr_playing_file.setVolume(0.0);  // you don't want users to notice that you are playing the file


    const self = this;
    // The plugin does not give the correct duration on playback start
    // Need to check for duration repeatedly
    let temp_duration = self.duration;
    this.get_duration_interval = setInterval(() => {
      if (self.duration === -1 || !self.duration) {
        self.duration = ~~(self.curr_playing_file.getDuration());  // make it an integer
      } else {
        if (self.duration !== temp_duration) {
          temp_duration = self.duration;
        }
        else {
          self.curr_playing_file.stop();
          self.curr_playing_file.release();

          clearInterval(self.get_duration_interval);
          this.display_duration = this.toHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
  }





  setToPlayback() {
    this.curr_playing_file = this.media.create(this.play_The_track);
    this.curr_playing_file.onStatusUpdate.subscribe(status => {
      switch (status) {
        case 1:
          break;
        case 2:   // 2: playing
          this.is_playing = true;
          break;
        case 3:   // 3: pause
          this.is_playing = false;
          break;
        case 4:   // 4: stop
        default:
          this.is_playing = false;
          break;
      }
    });
    this.is_ready = true;
    this.getAndSetCurrentAudioPosition();
  }





  getAndSetCurrentAudioPosition() {
    const diff = 1;
    const self = this;
    this.get_position_interval = setInterval(() => {
      const last_position = self.position;
      self.curr_playing_file.getCurrentPosition().then((position) => {
        if (position >= 0 && position < self.duration) {
          if (Math.abs(last_position - position) >= diff) {
            // set position
            self.curr_playing_file.seekTo(last_position * 1000);

          } else {
            // update position for display
            self.position = position;
            this.display_position = this.toHHMMSS(self.position);
          }
        } else if (position >= self.duration) {
          self.stop();
          self.setToPlayback();
        }
      });
    }, 100);
  }



  play() {
    console.log('Play');
    this.curr_playing_file.play();
  }


  pause() {
    console.log('Pause');
    this.curr_playing_file.pause();
  }


  stop() {
    console.log('Song Finish- Stop');
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;

    this.postSong_CompleteStatus(this.song_id);
  }



  controlSeconds(action) {
    console.log('Action Mode');
    const step = 10;
    const numberRange = this.position;
    switch (action) {
      case 'back':
        this.position = numberRange < step ? 0.001 : numberRange - step;
        break;
      case 'forward':
        this.position = numberRange + step < this.duration ? numberRange + step : this.duration;
        break;
      default:
        break;
    }
  }



  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i >= 0)
      .join(":")
  }






  postSong_CompleteStatus(track_id){
    this.capHttp.postData('/addAudioPost', {"journey_level_id": track_id, "status": "1"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
          // this.presentToast(res.message);
          this.eventServ.subsEvent({"subs": "active"});
      }else{
          this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }
  


  addTo_Wishlist(track_id){
    this.vibration.vibrate(100);
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "add"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
          this.song_fav = 'yes';
          this.eventServ.subsEvent({"subs": "active"});
      }else{
          this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }




  removeFrom_Wishlist(track_id){
    this.vibration.vibrate(100);
    this.capHttp.postData('/addFavourite', {"journey_level_id": track_id, "action": "remove"}, this.user_token).then((res:any) => {   console.log(res);
      // console.log(res.data);
      if(res.success === true){
         this.song_fav = 'no';
         this.eventServ.subsEvent({"subs": "active"});
      }else{
         this.presentToast(res.message);
      }
    }).catch( err => {
      // alert(JSON.stringify(err));
    });
  }




  async download_JourneySong(file_name, file_url){
    this.vibration.vibrate(100);
    // this.presentToast("cap_plugin err found!");
      await Share.share({
        title: 'The best program for deep relaxation.',
        text: "We're here to help you live a better, healthier life. Meditation & self care. Mind, body & soul.",
        url: 'https://relaxationer.com',
        dialogTitle: 'Share with buddies',
      });
  }






  async shareJourney_Song(){
    this.vibration.vibrate(100);
    await Share.share({
      title: 'The best program for deep relaxation.',
      text: "We're here to help you live a better, healthier life. Meditation & self care. Mind, body & soul.",
      url: 'https://relaxationer.com',
      dialogTitle: 'Share with buddies',
    });
  }





  async presentToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }





  ngOnDestroy() {
    console.log('Destroy Mode');
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }



  dismiss() {
    this.vibration.vibrate(100);
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
    this.modalCtrl.dismiss({'dismissed': true});
  } 




}

import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { ModalController } from '@ionic/angular';
// import { Moment } from 'moment';
import * as moment from 'moment';


@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.page.html',
  styleUrls: ['./date-select.page.scss'],
})
export class DateSelectPage implements OnInit {
  @ViewChild('datetime') datetime;
  @Input() pass_date: string;

  dateOfBirth: string;

  constructor(public modalCtrl: ModalController) { }




  selectDate(val){
    console.log(val)
    const formatted_DOB = moment(val).format('YYYY-MM-DD');
    console.log(formatted_DOB); 
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }



  ngOnInit() {
    console.log(this.pass_date);
    this.dateOfBirth = new Date(this.pass_date).toISOString();
  }

}

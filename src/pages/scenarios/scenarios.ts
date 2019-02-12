import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-scenarios',
  templateUrl: 'scenarios.html'
})

export class ScenariosPage {

  testRadioOpen: boolean;
  testRadioResult;
  current_scen = "Scen#1";

  constructor(public navCtrl: NavController,public alerCtrl: AlertController) {}

  //Radio button
  doRadio() {
     let alert = this.alerCtrl.create();
     alert.setTitle('Select a scenario');

     alert.addInput({
       type: 'radio',
       label: 'Scen#1',
       value: 'Scen#1',
       checked: true
     });

     alert.addInput({
       type: 'radio',
       label: 'Scen#2',
       value: 'Scen#2',
     });

     alert.addInput({
       type: 'radio',
       label: 'Scen#3',
       value: 'Scen#3',
     });

     alert.addButton('Cancel');
     alert.addButton({
       text: 'Ok',
       handler: data => {
         console.log('[SELECT] ~ Radio data : ', data);
         this.testRadioOpen = false;
         this.testRadioResult = data;
         this.current_scen = this.testRadioResult;
       }
     });

     alert.present().then(() => {
       this.testRadioOpen = true;
     });
 }

 //Launch scenario
 launch_scenario()
 {
   const confirm = this.alerCtrl.create({
      title: 'Scenario launch.',
      message: 'Do you really want to launch the scenario ('+this.current_scen+') ?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {console.log("[CANCEL] ~ Scenario "+this.current_scen+" start.")}
        },
        {
          text: 'Yes !',
          handler: () => {console.log("[LAUNCH] ~ Scenario "+this.current_scen+" start.")}
        }
      ]
    });
    confirm.present();
 }



}

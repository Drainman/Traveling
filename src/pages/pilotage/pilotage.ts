import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import nipplejs from 'nipplejs';

@Component({
  selector: 'page-pilotage',
  templateUrl: 'pilotage.html'
})
export class PilotagePage {

  size :number = 50;

  constructor(public bluetoothSerial: BluetoothSerial,public navCtrl: NavController, public navParams: NavParams) {
  }

  ngAfterViewInit() {

    //Joystick element
    console.log(document.getElementById('zone_joystick'));

    //BLE
    var macadr = "(d8:fb:5e:09:52:5c)";
    this.bluetoothSerial.connect(macadr).subscribe(function(){document.getElementById("res").innerHTML = "BLE OK"}, function(err){document.getElementById("res").innerHTML = "BLE KO | "+err;});;

    //Joystick optionss
    var options = {
          zone: document.getElementById('zone_joystick'),
          size: 2 * this.size,
          lockX  : true,
          color : "#1A6775"
      };

      //Creation
      var manager = nipplejs.create(options);
      var cpy_ble = this.bluetoothSerial;

      //manager
      manager.on('added', function (evt, nipple) {
        console.log('added');
        nipple.on('move', function (evt, data) {

          console.log(data);
          //Joystick direction : ok
          if(data.direction != undefined )
          {
            var sendForce = 0;
            if(Math.abs(data.force) <= 1){sendForce = data.force * 10;}//graduate force
            else{sendForce = 10;}//Max force
            //EVENT BLE
            console.log("[BLE_EVENT] ~ Force : "+sendForce+" | "+data.direction.x);
            cpy_ble.write('hello world').then(function(){document.getElementById("res").innerHTML = "OK"}, function(err){document.getElementById("res").innerHTML = "KO | "+err;});

          }

        });
        }).on('removed', function (evt, nipple) {
          console.log('removed');
          nipple.off('move');
      });
    }

    send_pilotage_instruction()
    {
      var macadr = "D8-FB-5E-09-52-5C";
      this.bluetoothSerial.connect(macadr);
      this.bluetoothSerial.write('hello world').then(function(){console.log("OK");}, function(){console.log("KO");});
    }

}

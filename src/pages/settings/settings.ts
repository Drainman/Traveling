import { Component } from '@angular/core';
import { NavController,ToastController,LoadingController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

@Component({
  selector: 'settings-home',
  templateUrl: 'settings.html'
})
export class SettingsPage {

	deviceId : string = "24:0A:C4:02:D2:82";
 	logmsgZone : Element;

	listToggle : boolean = false;
	pairedList : pairedlist;
	pairedDeviceID : number = 0;
	unpairedList : pairedlist;
	unpairedDeviceID : number = 0;

	bluetoothOn : boolean = false;

	constructor(private bluetoothSerial: BluetoothSerial, public navCtrl: NavController,private toastCtrl : ToastController,public loadingCtrl: LoadingController) {}

	present(){
		this.bluetoothSerial.enable().then(success =>{
	      this.showToast("Activation du bluetooth réussie");
	      this.bluetoothOn = true;
	      this.checkBluetoothEnable();
	    },error => {
	      this.showToast("Activation du bluetooth impossible");
	      this.bluetoothOn = false;
	    })

		//this.bluetoothSerial.connect(this.deviceId);//.then( success => {this.testConnexion;}, error => {this.onError("ERROR","Connexion failed."); } );
		//this.testConnexion();
	}

	//At initialization
    checkBluetoothEnable(){
      this.bluetoothSerial.isEnabled().then(success =>{
        this.bluetoothOn = true;
        this.bluetoothSerial.list().then(success=>{
          this.pairedList = success;
          this.listToggle = true;
        },error => {
          this.showToast("Erreur pendant le chargement des appareils");
          this.listToggle = false;
        })
      }, error =>{
        this.bluetoothOn = false;
        this.showToast("Veuillez activer le bluetooth");
      }
      );
    }

	scanForUnpaired()
    {
      this.bluetoothSerial.discoverUnpaired().then(success=>{
        this.unpairedList = success;
      },error => {
        this.showToast("Erreur pendant le scan");
      })
    }

    //onClick device
    selectDevice(){
      var loading = this.loadingCtrl.create({
        spinner: 'crescent',
        content: 'Connexion en cours'
      });

      loading.present();

      let connectedDevice = this.pairedList[this.pairedDeviceID];
      if(!connectedDevice.address)
      {
        this.showToast("Veuillez choisir un appareil auquel se connecter");
        return;
      }
      let address = connectedDevice.address;
      //let name = connectedDevice.name;
      this.bluetoothSerial.connect(address).subscribe(success => {
        this.showToast("Connexion réussie");
        loading.dismiss();
      },
      error=>{
        this.showToast("Connexion impossible");
		loading.dismiss();
      })
    }

    //onClick device
    selectDeviceUnpaired(){
      let connectedDevice = this.unpairedDeviceID[this.unpairedDeviceID];
      if(!connectedDevice.address)
      {
        this.showToast("Veuillez choisir un appareil auquel se connecter");
        return;
      }
      let address = connectedDevice.address;
      let name = connectedDevice.name;
      this.bluetoothSerial.connect(address).subscribe(success => {
        this.showToast("Connexion réussie à : " + name);
      },
      error=>{
        this.showToast("Connexion impossible");
      })
    }

    //onDisconnected
    deviceDisconnected() {
      this.bluetoothSerial.disconnect();
      this.showToast("Appareil déconnecté");
    }

    showToast(msj) {
      const toast = this.toastCtrl.create({
        message: msj,
        duration: 1000
      });
      toast.present();
    }

	testConnexion()
	{
		this.bluetoothSerial.subscribe('\n');//.then(this.onData, this.onError("ERROR","Subscribe failed."));
		this.sendData("hello world.");
		//this.bluetoothSerial.write('hello world').then(success, failure);
	}

	onError(type,msg)
	{
		document.getElementById("msg_log_block").innerHTML += "["+type+"] ~ "+msg+"<br>";
	}

	// data received from Arduino
	onData(data) {
		console.log(data);
		document.getElementById("msg_log_block").innerHTML += "[DATA] ~ Received: " + data + "<br/>";
		//this.logmsgZone.scrollTop = this.logmsgZone.scrollHeight;
	}

	// send data to Arduino
	sendData(dataMsg) {

		var success = function() {
			console.log("success");
			document.getElementById("msg_log_block").innerHTML += "[SENT] ~ A message has been sent.<br/>";
			//this.logmsgZone.scrollTop = this.logmsgZone.scrollHeight;
		};

		var failure = function() {
			alert("Failed writing data to Bluetooth peripheral");
			document.getElementById("msg_log_block").innerHTML += "[ERROR] ~ Message not sent.<br/>";
			//this.logmsgZone.scrollTop = this.logmsgZone.scrollHeight;
		};
		this.bluetoothSerial.write(dataMsg).then(success, failure);
	}
}

interface pairedlist {
  "class": number,
  "id": string,
  "address": string,
  "name": string
}

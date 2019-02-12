import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	deviceId : string = "24:0A:C4:02:D2:82";
 	logmsgZone : Element;

	constructor(private bluetoothSerial: BluetoothSerial, public navCtrl: NavController) {}

	present(){
		this.bluetoothSerial.enable();
		document.getElementById("msg_log_block").innerHTML += "[INFO] ~ Use default address : " + this.deviceId +".<br>";
		this.bluetoothSerial.connect(this.deviceId);//.then( success => {this.testConnexion;}, error => {this.onError("ERROR","Connexion failed."); } );
		this.testConnexion();
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

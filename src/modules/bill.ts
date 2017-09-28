import { Crud } from './crud';
import { Api } from '../api';
import { Auth } from './auth';
import { Observable } from 'rxjs/Observable'
import { Firebase } from './firebase'

declare var $:any;

export class Bill extends Crud {

    constructor(){
    	super("bill");
    }

    async sendBill(data){
        
        let access_token = await this.getAccessToken()

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/send_bill'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row;
    }

    async calculateShipFee(data){
        let access_token = await this.getAccessToken()
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/calculate_ship_fee'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        var res:any = await this.exec(settings);
        var row = res.results.object;
        return row;
    }

    async subscribe(){
        let authService:Auth = Api.module('auth')
        let access_token = await this.getAccessToken()
        console.log(authService.firebase_message_token)
        let data = {
            registration_token: authService.firebase_message_token,
        }
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url('/subscribe'),
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        var res:any = await this.exec(settings);
        return new Observable(sub =>{
            let firebaseService:Firebase = Api.module('firebase')
            $(firebaseService).on('on_message',(e,data)=>{
                if(data.topic == 'bills'){
                    sub.next(data.json)
                }
            })
        })
    }
}
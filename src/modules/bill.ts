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
    
    ActivityEnum: {
        BILL_SENT_SUCCESSFULLY: 'BILL_SENT_SUCCESSFULLY',
        BILL_DISTRIBUTED: 'BILL_DISTRIBUTED',
    
        BILL_WAITING_FOR_CONFIRMATION: 'BILL_WAITING_FOR_CONFIRMATION',
        BILL_MODIFIED_AT_WAITING_FOR_CONFIRMATION: 'BILL_MODIFIED_AT_WAITING_FOR_CONFIRMATION',
        BILL_CANCELLED_AT_WAITING_FOR_CONFIRMATION: 'BILL_CANCELLED_AT_WAITING_FOR_CONFIRMATION',
    
        BILL_CONFIRMED: 'BILL_CONFIRMED',
        BILL_MODIFIED_AT_BILL_CONFIRMED: 'BILL_MODIFIED_AT_BILL_CONFIRMED',
        BILL_CANCELLED_AT_BILL_CONFIRMED: 'BILL_CANCELLED_AT_BILL_CONFIRMED',
    
        BILL_PICKING_UP: 'BILL_PICKING_UP',
        BILL_MODIFIED_AT_PICKING_UP: 'BILL_MODIFIED_AT_PICKING_UP',
        BILL_CANCELLED_AT_PICKING_UP: 'BILL_CANCELLED_AT_PICKING_UP',
    
        BILL_RECEIVED: 'BILL_RECEIVED',
        BILL_MODIFIED_AT_RECEIVED: 'BILL_MODIFIED_AT_RECEIVED',
        BILL_CANCELLED_AT_RECEIVED: 'BILL_CANCELLED_AT_RECEIVED',
    
        BILL_PROCESSING: 'BILL_PROCESSING',
        BILL_MODIFIED_AT_PROCESSING: 'BILL_MODIFIED_AT_PROCESSING',
        BILL_CANCELLED_AT_PROCESSING: 'BILL_CANCELLED_AT_PROCESSING',
    
        BILL_PREPARED: 'BILL_PREPARED',
        BILL_MODIFIED_AT_PREPARED: 'BILL_MODIFIED_AT_PREPARED',
        BILL_CANCELLED_AT_PREPARED: 'BILL_CANCELLED_AT_PREPARED',
    
        BILL_SENT_SHIPPER: 'BILL_SENT_SHIPPER',
        BILL_MODIFIED_AT_SENT_SHIPPER: 'BILL_MODIFIED_AT_SENT_SHIPPER',
        BILL_CANCELLED_AT_SENT_SHIPPER: 'BILL_CANCELLED_AT_SENT_SHIPPER',
    
        BILL_DELIVERING: 'BILL_DELIVERING',
        BILL_MODIFIED_AT_DELIVERING: 'BILL_MODIFIED_AT_DELIVERING',
        BILL_CANCELLED_AT_DELIVERING: 'BILL_CANCELLED_AT_DELIVERING',
    
        BILL_PAID: 'BILL_PAID',
        BILL_MODIFIED_AT_PAID: 'BILL_MODIFIED_AT_PAID',
    
        BILL_COLLECTED_MONEY: 'BILL_COLLECTED_MONEY',
        BILL_MODIFIED_AT_COLLECTED_MONEY: 'BILL_MODIFIED_AT_COLLECTED_MONEY'
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

    async changeActivity(bill_id,data){
        let { activity , note } = data
        const access_token = await this.getAccessToken()
        let settings:any = {
            "async": true,
            "crossDomain": true,
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "access_token": access_token,
            },
            "processData": false,
            "data": JSON.stringify(data)
        }
        switch(activity){
            case this.ActivityEnum.BILL_WAITING_FOR_CONFIRMATION:
                settings.url = this.url(`/${bill_id}/activity/waitingForConfirmationBillStatus`)
                break
            default:
                throw new Error('This activity not allow for this bill')
        }

        let res:any = await this.exec(settings);
        let row = res.results.object;
        return row;
    }

    
}
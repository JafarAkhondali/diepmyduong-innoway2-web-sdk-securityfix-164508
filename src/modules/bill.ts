import { Crud } from './crud';
import { Api } from '../api';
import { Auth } from './auth';
import { Observable } from 'rxjs/Observable'
import { Firebase } from './firebase'

declare var $: any;

export class Bill extends Crud {

  constructor() {
    super("bill");
    this.ActivityEnum = {
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
  }

  ActivityEnum: any

  async sendBill(data) {

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

    var res: any = await this.exec(settings);
    var row = res.results.object;
    return row;
  }

  async calculateShipFee(data) {
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

    var res: any = await this.exec(settings);
    var row = res.results.object;
    return row;
  }

  async subscribe() {
    let authService: Auth = Api.module('auth')
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

    var res: any = await this.exec(settings);
    return new Observable(sub => {
      let firebaseService: Firebase = Api.module('firebase')
      $(firebaseService).on('on_message', (e, data) => {
        if (data.topic == 'bills') {
          sub.next(data.json)
        }
      })
    })
  }

  async orderAtStore(data) {
    let { address, sub_fee, sub_fee_note, channel, pay_amount, receive_amount, products } = data;
    const access_token = await this.getAccessToken()
    let settings: any = {
      "async": true,
      "crossDomain": true,
      "method": "POST",
      "url": this.url('/order_at_store'),
      "headers": {
        "content-type": "application/json",
        "access_token": access_token,
      },
      "processData": false,
      "data": JSON.stringify({
        address, sub_fee, sub_fee_note, channel, pay_amount, receive_amount, products
      })
    }

    var res: any = await this.exec(settings);
    var row = res.results.object;
    return row;
  }

  async changeActivity(bill_id, data) {
    let { activity, employee_id, note } = data
    const access_token = await this.getAccessToken()
    let settings: any = {
      "async": true,
      "crossDomain": true,
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "access_token": access_token,
      },
      "processData": false,
      "data": JSON.stringify({
        employee_id, note
      })
    }
    console.log("activity enum", this.ActivityEnum)
    switch (activity) {
      case this.ActivityEnum.BILL_SENT_SUCCESSFULLY:
        settings.url = this.url(`/${bill_id}/activity/sentSuccessfullyBillStatus`);
        break;
      case this.ActivityEnum.BILL_DISTRIBUTED:
        settings.url = this.url(`/${bill_id}/activity/distributedBillStatus`);
        break;
      case this.ActivityEnum.BILL_WAITING_FOR_CONFIRMATION:
        settings.url = this.url(`/${bill_id}/activity/waitingForConfirmationBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_WAITING_FOR_CONFIRMATION:
        settings.url = this.url(`/${bill_id}/activity/waitingForConfirmationBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_WAITING_FOR_CONFIRMATION:
        settings.url = this.url(`/${bill_id}/activity/waitingForConfirmationBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_CONFIRMED:
        settings.url = this.url(`/${bill_id}/activity/confirmedBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_BILL_CONFIRMED:
        settings.url = this.url(`/${bill_id}/activity/confirmedBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_BILL_CONFIRMED:
        settings.url = this.url(`/${bill_id}/activity/confirmedBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_PICKING_UP:
        settings.url = this.url(`/${bill_id}/activity/pickingUpBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_PICKING_UP:
        settings.url = this.url(`/${bill_id}/activity/pickingUpBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_PICKING_UP:
        settings.url = this.url(`/${bill_id}/activity/pickingUpBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_RECEIVED:
        settings.url = this.url(`/${bill_id}/activity/receivedBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_RECEIVED:
        settings.url = this.url(`/${bill_id}/activity/receivedBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_RECEIVED:
        settings.url = this.url(`/${bill_id}/activity/receivedBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_PROCESSING:
        settings.url = this.url(`/${bill_id}/activity/processingBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_PROCESSING:
        settings.url = this.url(`/${bill_id}/activity/processingBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_PROCESSING:
        settings.url = this.url(`/${bill_id}/activity/processingBillStatus/deleted`);
        break;
      case this.ActivityEnum.BILL_PREPARED:
        settings.url = this.url(`/${bill_id}/activity/preparedBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_PREPARED:
        settings.url = this.url(`/${bill_id}/activity/preparedBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_PREPARED:
        settings.url = this.url(`/${bill_id}/activity/preparedBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_SENT_SHIPPER:
        settings.url = this.url(`/${bill_id}/activity/sentShipperBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_SENT_SHIPPER:
        settings.url = this.url(`/${bill_id}/activity/sentShipperBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_CANCELLED_AT_SENT_SHIPPER:
        settings.url = this.url(`/${bill_id}/activity/sentShipperBillStatus/cancelled`);
        break;
      case this.ActivityEnum.BILL_PAID:
        settings.url = this.url(`/${bill_id}/activity/paidBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_PAID:
        settings.url = this.url(`/${bill_id}/activity/paidBillStatus/modified`);
        break;
      case this.ActivityEnum.BILL_COLLECTED_MONEY:
        settings.url = this.url(`/${bill_id}/activity/collectedMoneyBillStatus`);
        break;
      case this.ActivityEnum.BILL_MODIFIED_AT_COLLECTED_MONEY:
        settings.url = this.url(`/${bill_id}/activity/collectedMoneyBillStatus/modified`);
        break;
      default:
        throw new Error('This activity not allow for this bill');
    }

    let res: any = await this.exec(settings);
    return res;
  }


}

import { Crud } from './crud';

export class Promotion extends Crud {

  constructor() {
    super("promotion");
  }

  async validate(id, customer_id) {
    let access_token = await this.getAccessToken()
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": this.url(`/${id}/validate`, {
        customer_id
      }),
      "headers": {
        "access_token": access_token,
      },
      "method": "GET"
    }
    let res: any = await this.exec(settings);
    return true;
  }

  async addCustomerTypes(id, customer_type_ids) {
    let access_token = await this.getAccessToken()

    let settings = {
      "async": true,
      "crossDomain": true,
      "url": this.url(`/${id}/customer_types`),
      "headers": {
        "content-type": "application/json",
        "access_token": access_token,
      },
      "method": "POST",
      "data": JSON.stringify({
        customer_type_ids
      })
    }
    let res: any = await this.exec(settings);
    let rows = res.results.object.rows
    return rows;
  }

  async updateCustomerType(id, customer_type_ids) {
    let access_token = await this.getAccessToken()

    let settings = {
      "async": true,
      "crossDomain": true,
      "url": this.url(`/${id}/customer_types`),
      "headers": {
        "content-type": "application/json",
        "access_token": access_token,
      },
      "method": "PUT",
      "data": JSON.stringify({
        customer_type_ids
      })
    }
    let res: any = await this.exec(settings);
    let rows = res.results.object.rows
    return rows;
  }

  async sendPromotionToMessenger(id, message) {
    let access_token = await this.getAccessToken()

    let settings = {
      "async": true,
      "crossDomain": true,
      "url": this.url(`/${id}/send`),
      "headers": {
        "content-type": "application/json",
        "access_token": access_token,
      },
      "method": "POST",
      "data": JSON.stringify({
         message
      })
    }
    let res: any = await this.exec(settings);
    let rows = res.results.object.rows
    return rows;
  }


}

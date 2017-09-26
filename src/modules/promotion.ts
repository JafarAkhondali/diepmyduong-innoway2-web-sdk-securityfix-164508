import { Crud } from './crud';

export class Promotion extends Crud {

    constructor(){
    	super("promotion");
    }

    async validate(id,customer_id){
        let access_token = await this.getAccessToken()
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": this.url(`/${id}/validate`,{
                customer_id
            }),
            "headers": {
                "access_token": access_token,
            },
            "method": "GET"
        }
        let res:any = await this.exec(settings);
        return true;
    }   

}
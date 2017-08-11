import { Customer } from './customer';

import { Product } from './product';
import { Topping } from './topping';
import { ToppingValue } from './topping_value';
import { ProductTopping } from './product_topping';
import { Attribute } from './attribute';
import { ProductAttribute } from './product_attribute';
import { ProductType } from './product_type';
import { ProductCategory } from './product_category';
import { ProductStock } from './product_stock';

import { Bill } from './bill';
import { BillActivity } from './bill_activity';
import { BillItem } from './bill_item';
import { BillItemTopping } from './bill_item_topping';
import { BillShipDetail } from './bill_ship_detail';
import { BillSubFee } from './bill_sub_fee';

//Khai báo module được sử dụng
const classes = { 
    customer: new Customer(),

    product: new Product(),
    topping: new Topping(),
    topping_value: new ToppingValue(),
    product_topping: new ProductTopping(),
    attribute: new Attribute(),
    product_attribute: new ProductAttribute(),
    product_type: new ProductType(),
    product_category: new ProductCategory(),
    product_stock: new ProductStock(),

    bill: new Bill(),
    bill_activity: new BillActivity(),
    bill_item: new BillItem(),
    bill_item_topping: new BillItemTopping(),
    bill_ship_detail: new BillShipDetail(),
    bill_sub_fee: new BillSubFee(),
};

export default function Module(name) {
  return classes[name];
}
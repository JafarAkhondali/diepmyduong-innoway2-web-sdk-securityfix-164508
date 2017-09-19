import { Info } from './info';

import { Brand } from './brand';
import { BrandShip } from './brand_ship';

import { Branch } from './branch';
import { BranchWorkingSchedule } from './branch_working_schedule';

import { Employee } from './employee';
import { EmployeeType } from './employee_type';
import { EmployeeLocation } from './employee_location';

import { Customer } from './customer';
import { CustomerType } from './customer_type';
import { CustomerRegistration } from './customer_registration';

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

import { ShipFee } from './ship_fee';
import { ShipArea } from './ship_area';

import { Basket } from './basket';

import { Unit } from './unit';

import { Promotion } from './promotion';
import { PromotionType } from './promotion_type';

import { Auth } from './auth';

//Khai báo module được sử dụng
const classes = { 
	info: new Info(),
    brand: new Brand(),
    brand_ship: new BrandShip(),

    branch: new Branch(),
    branch_working_schedule: new BranchWorkingSchedule(),

    employee: new Employee(),
    employee_type: new EmployeeType(),
    employee_location: new EmployeeLocation(),

    customer: new Customer(),
    customer_type: new CustomerType(),
    customer_registration: new CustomerRegistration(),

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

    ship_fee: new ShipFee(),
    ship_area: new ShipArea(),

    basket: new Basket(),
    
    unit: new Unit(),

    promotion: new Promotion(),
    promotion_type: new PromotionType(),

    auth: new Auth()
};

export default function Module(name) {
  return classes[name];
}
import { Product } from './product';
import { Customer } from './customer';
import { Topping } from './topping';
import { ToppingValue } from './topping_value';
import { ProductTopping } from './product_topping';
import { Attribute } from './attribute';
import { ProductAttribute } from './product_attribute';
import { ProductType } from './product_type';
import { ProductCategory } from './product_category';
import { ProductStock } from './product_stock';

//Khai báo module được sử dụng
const classes = { 
    product: new Product(),
    customer: new Customer(),
    topping: new Topping(),
    topping_value: new ToppingValue(),
    product_topping: new ProductTopping(),
    attribute: new Attribute(),
    product_attribute: new ProductAttribute(),
    product_type: new ProductType(),
    product_category: new ProductCategory(),
    product_stock: new ProductStock(),
};

export default function Module(name) {
  return classes[name];
}
import { Product } from './product';
import { Customer } from './customer';
import { Info } from './info';

//Khai báo module được sử dụng
const classes = { 
    product: new Product(),
    customer: new Customer(),
    info: new Info()
};

export default function Module(name) {
  return classes[name];
}
import { Product } from './product';
import { Customer } from './customer';

//Khai báo module được sử dụng
const classes = { 
    product: new Product(),
    customer: new Customer(),
};

export default function Module(name) {
  return classes[name];
}
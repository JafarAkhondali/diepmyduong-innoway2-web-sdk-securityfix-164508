import { Product } from './product';


const classes = { 
    product: new Product(),
};

export default function Module(name) {
  return classes[name];
}
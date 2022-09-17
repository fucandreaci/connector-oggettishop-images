/*
 * File: index
 * Project: update-images-connector
 * File Created: 17/09/22 - 12:17
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {sourceController} from './controller/source.controller';
import {productController} from './controller/product.controller';

const exec = async () => {
    console.log('Start update images connector');
    const sourceProducts = await sourceController.getProducts()
    const destinationProducts = await productController.fetchProducts()

    productController.updateImages(sourceProducts, destinationProducts)
    console.log('End update images connector');
}

exec()
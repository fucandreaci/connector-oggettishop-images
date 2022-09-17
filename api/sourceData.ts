/*
 * File: sourceData
 * Project: connector-node
 * File Created: 04/07/22 - 23:36
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import allProd from '../allProd_original.json';
import {SourceProduct} from '../models/Source';

const fetchProducts = (): Promise<SourceProduct[]> => {
    return Promise.resolve(allProd);
}

export const sourceData = {
    fetchProducts,
}
/*
 * File: product.controller
 * Project: update-images-connector
 * File Created: 17/09/22 - 11:44
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {SourceProduct} from '../models/Source';
import {Image, Product} from '../models/Destination';
import {utils} from '../utility/utils';
import {destinationData} from '../api/destinationData';

const getProductBySku = (sku: string, products: Product[]) => {
  return products.find((product) => product.sku === sku);
}

const getImage = async (product: SourceProduct): Promise<Image | undefined> => {
    const images = utils.getImages(product);
    const betterImage = await utils.getBetterImage(images);
    return betterImage;
}

const updateImages = async (sourceProducts: SourceProduct[], products: Product[]) => {
    for (const sourceProduct of sourceProducts) {
        const prodName = sourceProduct.codice.slice(0, 7);

        let parent = getProductBySku(sourceProduct.articolo_padre, products);
        if (!parent || !parent.id)
            continue;

        const variations = await destinationData.fetchProductVariations(parent.id);
        const isVariable = sourceProduct.codice !== sourceProduct.articolo_padre;

        const product = isVariable ? getProductBySku(sourceProduct.codice, variations) : parent;

        const img = await getImage(sourceProduct);
        if (!img || !('images' in parent))
            continue;

        if (isVariable) {
            if (product && 'image' in product && product.id) {

                product.image = img ? img : {};

                // Update woocommerce product
                await destinationData.updateVariation(product, parent.id, product.id);
                //if (!parent.image || !parent.image.src?.includes(prodName)) {

                //}
            }
        }

        const tmpProd = await destinationData.fetchById(parent.id);
        if ('images' in tmpProd && !tmpProd.images.find((image) => image.src?.includes(prodName))) {
            const images: Image[] = tmpProd.images.map((image) => {
                return {
                    id: image.id,
                };
            });
            images.push(img);

            parent.images = images;
            await destinationData.updateProduct(parent);
        }
    }
}

const fetchProducts = async () : Promise<Product[]>=> {
    const data = await destinationData.fetchProducts()
    return data
}

export const productController = {
    fetchProducts,
    updateImages
}
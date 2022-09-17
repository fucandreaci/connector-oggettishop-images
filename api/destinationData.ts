/*
 * File: destinationData
 * Project: connector-node
 * File Created: 04/07/22 - 23:54
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {Attribute, Product} from '../models/Destination';
import {getApi} from './index';

const api = getApi();

const fetchProducts = async (): Promise<Product[]> => {
    const products: Product[] = []
    const res = await api.get("products");
    products.push(...res.data)

    for (let i = 2; i <= res.headers['x-wp-totalpages']; i++) {
        const result = await api.get("products?page=" + i);
        products.push(...result.data)
    }

    return products
}

const fetchProductVariations = async (productId: number): Promise<Product[]> => {
    const variations: Product[] = []
    const res = await api.get(`products/${productId}/variations`);
    variations.push(...res.data)

    for (let i = 2; i <= res.headers['x-wp-totalpages']; i++) {
        const result = await api.get(`products/${productId}/variations?page=` + i);
        variations.push(...result.data)
    }

    return variations

}

const fetchById = async (productId: number): Promise<Product> => {
    const response = await api.get(`products/${productId}`);
    return response.data;
}

const fetchAttributes = async (): Promise<Attribute[]> => {
    const attributes: Attribute[] = []
    const res = await api.get("products/attributes");
    attributes.push(...res.data)

    return attributes;
}

const updateProduct = async (product: Product): Promise<Product> => {
  const response = await api.put(`products/${product.id}`, product);
  return response.data;
}

const updateVariation = async (product: Partial<Product>, idProduct: number, idVariation: number) => {
    return await api.put(`products/${idProduct}/variations/${idVariation}`, product);
}

export const destinationData = {
    fetchProducts,
    fetchProductVariations,
    fetchAttributes,
    fetchById,
    updateProduct,
    updateVariation
}
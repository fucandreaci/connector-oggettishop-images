/*
 * File: utils
 * Project: update-images-connector
 * File Created: 17/09/22 - 11:51
 * Author: Andrea Fucci (fucciandrea01@gmail.com)
 * Copyright © 2022-2022 Andrea Fucci
 */

import {SourceProduct} from '../models/Source';
import {Image} from '../models/Destination';
import axios from 'axios';

const getImages = (product: SourceProduct): Image[] => {
    const images: Image[] = [];

    if (typeof product.Link_Foto !== 'string') {
        if (typeof product.Link_Foto.Foto !== 'string') {
            const photos: string[] = product.Link_Foto.Foto;
            photos.forEach(photo => {
                images.push({
                    src: photo
                })
            })
        }
    }

    return images;
}

const getImageDimension = (image: Image): number => {
    // https://catalogs-online.com/images/700x700/CA600NE.jpg

    const url = image.src;

    if (!url) return -1;
    const parts = url.replace('https://', '').split('/');

    if (parts.length < 4) return -1;
    const dimension = parts[2];
    if (!dimension) return -1;

    const dimensionParts = dimension.split('x');
    if (dimensionParts.length < 2) return -1;
    const width = dimensionParts[0];
    const height = dimensionParts[1];
    if (!width || !height) return -1;
    return parseInt(width);
}

const getBetterImage = async (images: Image[]): Promise<Image | undefined> => {
    const imagesWithDimension: {
        image: Image,
        dimension: number
    }[] = []

    images.forEach(image => {
        const dimension = getImageDimension(image);
        imagesWithDimension.push({
            image,
            dimension
        })
    })
    const sortedImages = imagesWithDimension.sort((a, b) => a.dimension - b.dimension);

    const image500 = sortedImages.filter(i => i.dimension == 500);
    //if (image500) return image500.image;

    const bestImages = image500 ? image500 : sortedImages.filter(i => i.dimension > 250);

    // get random image
    while (bestImages.length) {
        const randomIndex = Math.floor(Math.random() * bestImages.length);
        const image = bestImages[randomIndex];
        if (image && image.image && image.image.src) {
            try {
                const imgFetch = await imageExists(image.image.src)
                if (imgFetch.status==200)
                    return image.image;
            } catch (e) {
                console.log('404 immagine', image.image.src)
            }
        }
        bestImages.splice(randomIndex, 1);
    }

    return undefined;
}

const imageExists = async (url: string) => {
    return await axios.get(url)
}

export const utils = {
    getImages,
    getBetterImage
}
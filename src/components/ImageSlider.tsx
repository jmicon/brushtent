"use client"
import React, { useState, FC } from 'react';
import Link from 'next/link'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type imageObject = {
  id: number
  image: string
}

type Props = {
  styles: string
  images: imageObject[]
  product_id: number
  displayViewProduct?: boolean
  imageLink?: boolean
}


const ImageSlider: FC<Props> = ({ styles, images, product_id, displayViewProduct=false, imageLink=true }) => {
  const [hover, setHover] = useState(false)
  const listImages = images.map(image => {
    return (
      <CarouselItem key={image.id}>
      <div className={`aspect-square duration-100`} onMouseOver={() => {setHover(true)}} onMouseLeave={() => [setHover(false)]}>
        {imageLink ? (
          <Link href={`/product/${product_id}`}>
            <img 
              src={image.image} 
              alt="product image" 
              className='object-cover w-full h-full'
            />
          </Link> 
        )
        :
        (
          <img 
            src={image.image} 
            alt="product image" 
            className='object-cover w-full h-full'
          />
        )
      }
        </div>    
    </CarouselItem>
    )
  }) 

  return (
    <>
    <div className={`m-auto ${styles}`}>
      <Carousel>
        <CarouselContent>
          {listImages}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>

    </>
)
}

export default ImageSlider
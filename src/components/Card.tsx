import Link from 'next/link'

import { Button } from "@/components/ui/button";
import ImageSlider from './ImageSlider';

type imageObject = {
  id: number
  image: string
}

type Props = {
  title: string
  description: string
  price: number
  images: imageObject[]
  product_id: number
  displayViewProduct: boolean
}
// w-72
// title, description, price, images
const Card = ({title, description, price, images, product_id, displayViewProduct}: Props) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-md hover:cursor-pointer hover:shadow-xl hover:-translate-y-1 duration-200 m-2 mb-6">
        <div className="">
            <div className='rounded-3xl'>
              <ImageSlider styles={"w-full"} images={images} product_id={product_id} displayViewProduct={displayViewProduct}/>
            </div>
        </div>
        <Link href={`/product/${product_id}`}>
          <div className="flex justify-between items-end p-1">
              <div className='truncate w-4/5'>
                  <p className="truncate">{title}</p>
                  <p className="truncate">{description}</p>
              </div>
              <div className='pl-4'>
                <Button>${price}</Button>
              </div>
          </div>
        </Link>

  </div>
)
}

export default Card
import Card from "@/components/Card"
import { title } from 'process'
import { describe } from 'node:test'
import PaginationContainer from "./PaginationContainer"

type Props = {
  productData: productDataType[]
}

type imageObject = {
  id: number
  image: string
}
type tagObject = {
  id: number
  tag: string
}

type productDataType = {
  product_id: number
  title: string
  description: string
  price: number
  fk_users_id: number
  upload_time: string
  tags: tagObject[]
  images: imageObject[]
  download: string  
  user_id: number
  user: string
  user_image: string

}

const BetterFeed = async ({ productData }: Props) => {

  return (
    <section className="md:mx-auto md:max-w-screen-xl m-4 border">
        <div className="md:grid md:grid-cols-4 md:m-auto md:max-w-screen-2xl ">
        {productData?.map((product:productDataType) => {
            return <Card title={product.title} description={product.description} price={product.price} images={product.images} product_id={product.product_id} displayViewProduct={true} key={product.product_id}/>
          })}
        </div>
    </section>
)
}

export default BetterFeed
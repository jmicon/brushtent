import Card from "@/components/Card"
import PaginationContainer from "./PaginationContainer"
import axios from "axios"

type Props = {
  searchParams: { [key: string]: string | undefined }
  endpoint: string
  userId?: string
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



async function getData (pageParam:string, endpoint:string, userId?:string) {
  try {
    const response = await axios.get(`/api/product/get/all`, {
      params: {
        id: userId,
        page: pageParam
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data

  } catch (error:any) {
    console.error('Failed to fetch data:', error.message)
    throw error

  }
}

const Feed = async ({ searchParams, endpoint, userId }: Props) => {
  
  let page = searchParams['page'] ?? '1' 
  const data = await getData(page, endpoint, userId)
  const itemsPerPage = 1
  return (
    <section className="md:mx-auto md:max-w-screen-xl m-4 border">
        <div className="md:grid md:grid-cols-4 md:m-auto md:max-w-screen-2xl border">
        {data.products?.map((product:productDataType) => {
            return <Card title={product.title} description={product.description} price={product.price} images={product.images} product_id={product.product_id} displayViewProduct={true} key={product.product_id}/>
          })}
          
        </div>
        <PaginationContainer totalPages={data.total_pages} currentPage={Number(page)} />
    </section>
)
}

export default Feed
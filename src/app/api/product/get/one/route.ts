import sql from "@/app/api/postgres"

// get a single product's data by the id
// select all from product where product id = 12
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    try {

        if (!id) return Response.json({error: "url contains no id"})

        const product = await sql`
        SELECT 
            product.product_id,
            product.title,
            product.description,
            product.price,
            product.fk_users_id,
            product.upload_time,
            jsonb_agg(DISTINCT jsonb_build_object('id', tag.tag_id, 'tag', tag.title)) AS tags,
            jsonb_agg(DISTINCT jsonb_build_object('id', ordered_images.product_image_id, 'image', ordered_images.product_image, 'public_id', ordered_images.public_id, 'order', ordered_images.order)) AS images,
            jsonb_agg(DISTINCT product_download.product_download_link) AS download,
            users.id AS user_id,
            users."name" AS user,
            users.image AS user_image
        FROM
            product
        LEFT JOIN 
            tag ON tag.fk_product_id = product.product_id
        LEFT JOIN 
            (
            SELECT 
                *
            FROM 
                product_image
            ORDER BY 
                product_image."order" 
            ) AS ordered_images
            ON ordered_images.fk_product_id = product.product_id
        LEFT JOIN 
            product_download ON product_download.fk_product_id = product.product_id
        LEFT JOIN 
            users ON users.id = product.fk_users_id 
        GROUP BY 
            product.product_id,
            users.id 
        HAVING
            product.product_id = ${id};
        `
        return Response.json(product)
        
    } catch (error: any) {
        return Response.json({error: error.message})
    }
}

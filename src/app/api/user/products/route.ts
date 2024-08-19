import sql from "@/app/api/postgres"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        // unique user identifier
        const id = searchParams.get('id')
        if (!id) return Response.json({error: "url contains no id"})
        
        let pageNumberString = searchParams.get('page') // ?page=1
        let pageNumber = Number(pageNumberString)
        // if pageNumberString is null, default to first page
        if (!pageNumberString) pageNumber = 1
        if (pageNumber <= 0 || isNaN(pageNumber)) pageNumber = 1
        // check if pageNumber is a number
        if (isNaN(pageNumber)) return Response.json({error: "page number value is invalid"})

        // Determines the number of items per page
        const limit = 8
        const offset = (pageNumber - 1) * limit
        
        const userData = await sql`
        SELECT 
            *
        FROM
            users
        WHERE
            id = ${id}
        `
        console.log("server", id);
        const userProducts = await sql`
        SELECT 
            p.*,
            jsonb_agg(DISTINCT jsonb_build_object('id', ordered_images.product_image_id, 'image', ordered_images.product_image)) AS images
        FROM
            product p
        LEFT JOIN
            (
            SELECT 
                *
            FROM 
                product_image
            ORDER BY 
                product_image."order" 
            ) AS ordered_images
            ON ordered_images.fk_product_id = p.product_id
        GROUP BY 
            p.product_id
        HAVING
            p.fk_users_id = ${id}
        ORDER BY 
            p.upload_time DESC
        LIMIT ${limit} OFFSET ${offset}
        `
        
        const totalPages = await sql`
        SELECT CEIL(COUNT(*)::NUMERIC / ${limit}) AS total_pages
        FROM 
            product
        WHERE
            product.fk_users_id = ${id}
        `
        
        return Response.json({ user: userData, products: userProducts, total_pages: totalPages[0].total_pages })
        
    } catch (error: any) {
        return Response.json({error: error.message})
    }
}

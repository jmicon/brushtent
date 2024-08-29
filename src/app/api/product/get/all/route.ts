// pages/api/product/get/all.ts
import sql from "@/app/api/postgres";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        let pageNumberString = searchParams.get('page'); // ?page=1
        let pageNumber = Number(pageNumberString);
        // if pageNumberString is null, default to first page
        if (!pageNumberString) pageNumber = 1;
        // check if pageNumber is a number
        if (pageNumber <= 0 || isNaN(pageNumber)) pageNumber = 1;

        // Determines the number of items per page
        const limit = 8;
        const offset = (pageNumber - 1) * limit;

        const products = await sql`
        SELECT 
            product.product_id,
            product.title,
            product.description,
            product.price,
            product.fk_users_id,
            product.upload_time,
            jsonb_agg(DISTINCT jsonb_build_object('id', tag.tag_id, 'tag', tag.title)) AS tags,
            jsonb_agg(DISTINCT jsonb_build_object('id', ordered_images.product_image_id, 'image', ordered_images.product_image)) AS images,
            jsonb_agg(DISTINCT product_download.product_download_link) AS download,
            users."name",
            users.id,
            user_image.profile_image
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
        JOIN 
            users ON users.id = product.fk_users_id
        LEFT JOIN 
            user_image ON user_image.fk_user_id = users.id
        GROUP BY 
            product.product_id, 
            users.id, 
            user_image.user_image_id
        ORDER BY 
            product.upload_time DESC
        LIMIT ${limit} OFFSET ${offset};
        `;

        const totalPages = await sql`
        SELECT CEIL(COUNT(*)::NUMERIC / ${limit}) AS total_pages
        FROM product;
        `;

        return new Response(JSON.stringify({ products, total_pages: totalPages[0].total_pages }));

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

import sql from "@/app/api/postgres"

export async function GET(req: Request) {
    try {
        // const data = await sql`
        // SELECT * FROM playing_with_neon
        // `
        
        const tagArray = ["www", "ppppp"]
        const tagsInsert:any = []
        for (let tag in tagArray) {
            let tagValue = {
                title: tagArray[tag],
                fk_product_id: 12
            } 
            tagsInsert.push(tagValue)
        }
        // console.log(tagsInsert)
        const columns = ['title', 'fk_product_id']

        const values = tagArray.map(tag => `('${tag}', 12)`).join(', ');
        // console.log(values);
        const insert = 'INSERT INTO'
        // const newTags = await sql`INSERT INTO tag (title, fk_product_id) VALUES ('fsao', 12) RETURNING *;`
        const newTags = await sql`INSERT INTO tag ${ sql(tagsInsert) } RETURNING *`;
        // const newTags = await sql`INSERT INTO tag (title, fk_product_id) VALUES ${values} RETURNING *`
        // const newTags = await sql`INSERT INTO tag (title, fk_product_id) VALUES ('www', 12), ('ppppp', 12) RETURNING *`;
        // const query = `INSERT INTO tag (title, fk_product_id) VALUES ${values}`
        // const newTags = await sql.unsafe(q)

        return Response.json(newTags)
        
    } catch (error: any) {
        return Response.json({error: error.message})
    }
}

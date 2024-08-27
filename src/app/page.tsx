import { auth } from "@/auth"
// import { useEffect, useState } from "react";
import Feed from "@/components/Feed";

import {NextUIProvider} from "@nextui-org/system";

// searchParams on pages takes the parameters from the url -> ?page=2 gives { page: "2" }
export default async function Home({ searchParams }: {
  searchParams: {[key:string]: string | undefined}
}) {
  // const {data: session} = useSession()
  const session = await auth()
  // if (!session || !session.user ) return <div>You are NOT authorized</div>

  return (
    <main>
      <NextUIProvider>
        <Feed searchParams={searchParams} endpoint={`/api/product/get/all?page=`} />

    </NextUIProvider>

    </main>
  );
}

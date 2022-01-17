import type { NextPage } from 'next'
import Link from 'next/link'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";

const Home: NextPage = observer(() => {
  const store = useStore();

  return (
    <div>
      <Link href="/api/jwt">
        jwtv
      </Link>
      {
        store.user.test
      }
    </div>
  )
})

export default Home

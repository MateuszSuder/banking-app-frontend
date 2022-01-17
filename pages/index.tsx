import type { NextPage } from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import {useRouter} from "next/dist/client/router";
import {useUser} from "@auth0/nextjs-auth0";
import {useEffect} from "react";

const Home: NextPage = observer(() => {
  const router = useRouter()
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if(!isLoading) {
      if(!user) {
        location.replace("/api/auth/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isLoading])

  return (
    <>
    </>
  )
})

export default Home

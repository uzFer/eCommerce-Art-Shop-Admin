import Layout from '@/components/Layout';
import { useSession } from "next-auth/react";

export default function Home() {
  const {data: session} = useSession();

  return <Layout>
    <div className="text-white flex justify-between">
      <h2>Hello, <b>{session?.user?.name}</b> </h2>
      
      <div className="flex bg-gray-200 gap-1 text-black rounded-lg">
        <img src={session?.user?.image} alt="user image" className="w-6 h-6 rounded-md overflow-hidden"/>
        <span className="px-2">{session?.user?.name}</span>
      </div>
    </div>
  </Layout>
}

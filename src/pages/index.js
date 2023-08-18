import Layout from '@/components/Layout';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';

export default function Home() {
  const [orders, setOrders] = useState([]);
  const {data: session} = useSession();

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  return <Layout>
    <div className="px-10 py-5">
      <div className="text-white flex justify-between mb-10">
        <h2>Hello, <b>{session?.user?.name}</b> </h2>
        <div className="flex bg-highlight gap-1 text-white rounded-lg">
          <img src={session?.user?.image} alt="user image" className="w-6 h-6 rounded-md overflow-hidden"/>
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="flex justify-center items-center flex-col">
          <h1>Orders</h1>
          {orders?.length > 0 &&
            <div className="text-white flex justify-between">
              <div className="text-white bg-black border-4 border-rose-500 w-36 h-36 rounded-full flex justify-center items-center text-2xl">
                {orders.length}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  </Layout>
}

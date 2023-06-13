import { useSession, signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}) {
  const { data: session } = useSession();
  const [ showNav, setShowNav ] = useState(false); 

  if(!session) {
    return (
      <div className="bg-dark w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    );
  }

  return ( 
    <div className="bg-dark min-h-screen" >
      <div className="block md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(!showNav)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-8">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Navbar show={showNav}/>
        <div className="flex-grow p-4">{children}</div>
      </div>
    </div>
  );
}

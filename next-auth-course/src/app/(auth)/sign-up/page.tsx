"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from "axios"
import toast from 'react-hot-toast'

export default function page() {
    const [user, setUser] = useState<Object>({
        email: "",
        password: "",
        username: ""
    });
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async () => {
      try{
        setLoading(true);
        const res = await axios.post("/api/auth/sign-up", user);

        if (res.data.success === false) {
          console.log("Some error occur");
          return;
        }

        toast.success('User signup successfull, please verify your email', {
          position: "bottom-center"
        })
      }catch(error: any){
        console.log("Sign up failed ", error);
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
    }
    

  return (
    <div className='flex flex-col gap-4'>
      <h1>Sign Up</h1>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id='username' placeholder='username' onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id='email' placeholder='email' onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id='password' placeholder='password' onChange={handleChange} />
      </div>
      <button disabled={loading} onClick={handleSubmit} className="px-4 py-2 rounded-md bg-transparent text-white border border-white w-48 cursor-pointer hover:bg-gray-400 transition-all duration-500">Sign Up</button>
      <Link href="/sign-in">Login</Link>
    </div>
  )
}

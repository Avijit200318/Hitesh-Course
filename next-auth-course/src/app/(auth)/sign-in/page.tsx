"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from "axios"
import toast from 'react-hot-toast'

export default function page() {
    const [user, setUser] = useState<Object>({
        email: "",
        password: ""
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
        const res = await axios.post("/api/auth/sign-in", user);
        console.log("sign in success ", res.data);

        if (res.data.success === false) {
          console.log("Some error occur");
          return;
        }

        router.push(`/profile/${res.data.user.username}`);
      }catch(error: any){
        console.log("Sign up failed ", error);
        toast.error(error.message);
      }finally{
        setLoading(false);
      }
    }

  return (
    <div className='flex flex-col gap-4 items-center justify-center'>
      <h1>Sign In</h1>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id='email' placeholder='email' onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id='password' placeholder='password' onChange={handleChange} />
      </div>
      <button disabled={loading} onClick={handleSubmit} className="px-4 py-2 rounded-md bg-transparent text-white border border-white w-48 cursor-pointer hover:bg-gray-400 transition-all duration-500">Sign In</button>
      <Link href="/sign-up">Sign up</Link>
    </div>
  )
}

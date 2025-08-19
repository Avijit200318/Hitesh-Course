"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'


export default function page() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try{
            const res = await axios.post("/api/auth/verify-user", {token});
            if(res.data.success === false){
                console.log("some error happend: ", res.data);
                return;
            }
            setVerified(true);

        }catch(error){
            setError(true);
            console.log("Error while verifying", error)
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        console.log("urlToken: ", urlToken);
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if(token.length > 0){
            verifyUserEmail();
        }
    }, [token]);

  return (
    <div>
      <h1 className='text-3xl'>Verifying Email Please Wait</h1>
      <h2>{token.length > 0 ? token : "No token"}</h2>

      {verified && (
        <div className="">
            <h2>Email Verified</h2>
            <Link href="/sign-in" className='px-4 py-2 border border-yellow-400 text-yellow-400'>Login</Link>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'

export default function SignIn() {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/hello`);
      const data = await res.json();

      if(data.success !== true){
        console.log("some error occur: ", data);
        return;
      }
      console.log("success: ", data.message);
      setMessage(data.message);
    } catch (error) {
      console.log("error occur: ", error);
    }
  }

  return (
    <div>
      this is sign up page
      <button onClick={handleSubmit}>Submit</button>
      {message && <h3>{message}</h3>}
    </div>
  )
}

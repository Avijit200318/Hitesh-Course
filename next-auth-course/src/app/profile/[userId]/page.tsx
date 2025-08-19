"use client"
import React from 'react'
import { useParams } from 'next/navigation'

export default function page() {
  const params = useParams<{userId: string}>();
  console.log("params: ", params);
  return (
    <div>
      this is the profile page
    </div>
  )
}

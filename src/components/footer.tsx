import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="w-fit mx-auto">
      <Link
        className="text-center text-white"
        target="_blank"
        href="https://hensonport.vercel.app"
      >
        Made with 💖 by Dreamerwebdev
      </Link>
    </div>
  );
}

export default Footer
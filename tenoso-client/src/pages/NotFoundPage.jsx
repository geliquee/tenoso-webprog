import React from 'react'
import { Link } from 'react-router-dom'
import notfound1 from '../assets/images/notfound1.png'

function NotFoundPage() {
    return (
        <div className="min-h-screen bg-[#ecf39e] flex flex-col items-center justify-center px-4 text-center">
            
            <img
                src={notfound1}
                alt="Lost Smiski"
                className="w-64 h-64 object-contain mb-6 ml-5"
            />

            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-green-500 mb-2">
                404 Error
            </p>

            <h1 className="text-4xl font-bold text-[#132a13] mb-4">
                Page Not Found
            </h1>

            <p className="text-[#31572c] text-sm max-w-sm leading-6 mb-8">
                Oops! Looks like this page got lost — just like a Smiski hiding in the dark. 
                The link you followed might be broken . . .
            </p>

            <Link
                to="/"
                className="bg-[#f9e07f] hover:bg-[#f4d03f] text-[#132a13] font-semibold text-sm uppercase 
                tracking-[0.24em] px-6 py-3 rounded-full border-2 border-[#90a955] transition-colors"
            >
                Back to Home
            </Link>

        </div>
    )
}

export default NotFoundPage
import { BACKEND_URL } from '@/lib/constants'
import React from 'react'

const GoogleButton = () => {
    return (
        <a href={`${BACKEND_URL}/auth/google/login`} className='flex justify-center border rounded-lg shadow px-4 py-2'>
            <span>Login with Google</span>
        </a>
    )
}

export default GoogleButton
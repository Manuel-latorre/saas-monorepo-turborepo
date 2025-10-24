import { getSession } from '@/app/(auth)/actions/session'
import React from 'react'

const SignoutButton = async() => {
    const session = await getSession();


  return (
    <div>
        
    </div>
  )
}

export default SignoutButton
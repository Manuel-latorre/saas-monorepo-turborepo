import React from 'react'
import { Button } from './ui/button'
import { getSession } from '@/app/(auth)/actions/session'
import Link from 'next/link';

const LoginButton = async () => {

    const session = await getSession();

  return (
    <div className='flex items-center gap-2'>
        {
            !session || !session.user ? 
            (
                <>
                    <Link href={"/login"}>Iniciar sesión</Link>
                    <Link href={"/signup"}>Registrarse</Link>
                </>
            )
            :
            (
                <>
                    <p>{session.user.name}</p>
                    <Link href={"/api/auth/signout"}>Cerrar sesión</Link>

                </>
            )
        }
    </div>
  )
}

export default LoginButton
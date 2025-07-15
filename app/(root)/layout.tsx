import React from 'react'
import { ReactNode } from 'react'// Anything that can be rendered: JSX, strings, numbers, arrays, fragments, components, etc. is ReactNode


import Link from "next/link";
import Image from "next/image";

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="root-layout">
            <nav>
                <Link href="/"  className="flex items-center gap-2" >
                    <Image src="/logo.svg" alt="Logo" width={38} height={32} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </Link>
            </nav>

            {children}
        </div>
    )
}
export default RootLayout


















// In React, children is a special prop. It refers to whatever you wrap inside a component when you use it.   

{/* <RootLayout>
  <h1>Hello World</h1>
</RootLayout> */}


//Here, <h1>Hello World</h1> is passed as the children prop to your RootLayout component.
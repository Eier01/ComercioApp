'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import ProductBusttons from './ProductBusttons/ProductBusttons'
import ProductTile from './ProductTile/ProductTile'


function CommonListing({data}) {
    const router = useRouter()
    //esto lo hace una sola vez cunado renderiza toda la aplicacion
    useEffect(() =>{
        router.refresh()
    },[])
    
    // const searchParams = useSearchParams()
    // const reload = searchParams.get('reload')


    // if(reload){
    //     setTimeout(() =>{
    //         window.location.reload(true);
    //     },2000) 
    //     router.push('/admin-view/all-products')   
    // }

    return (
        <section className='bg-white py-12 sm:py-16'>
            <div className='mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8'>
                <div className='mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 lg:mt-16'>
                    {
                        data && data.length? 
                        data.map((item) =>(
                            <article className='relative flex flex-col overflow-hidden border cursor-pointer' 
                                key={item._id}
                            >
                                <div
                                onClick={() => router.push(`/product/${item._id}`)}
                                >
                                    <ProductTile item={item}/>
                                </div>
                                <ProductBusttons item={item}/>
                            </article>
                        )):null
                    }
                </div>
            </div>
        </section>
    )
}

export default CommonListing
"use client";
import { useRouter } from 'next/navigation';
import React, { useContext,useEffect,useState } from 'react'
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { GlobalContext } from '../context';
import { getAllOrdersForUser } from '../services/order/orderService';

export default function Page() {
    const {user, pageLevelLoader, setPageLevelLoader,allOrdersForUser, setAllOrdersForUser} = useContext(GlobalContext)

    const router = useRouter()

    async function extractAllOrders(){
        setPageLevelLoader(true)
        const res = await getAllOrdersForUser(user.id)

        if(res.success){
            setPageLevelLoader(false)
            setAllOrdersForUser(res.data)
        }else{
            setPageLevelLoader(false)
            toast.error(res.message)
        }
    }

    useEffect(() =>{
        if(user !== null) extractAllOrders()
    },[user])


    if(pageLevelLoader){
        return (
            <div className='w-full min-h-screen flex justify-center items-center'>
                <SyncLoader
                    color={'#000000'}
                    loading={true}
                    size={27}
                    data-testid="loader"
                />
            </div>
        )    
    }

    return (
        <section className='bg-gray-200'>
            <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8'>
                    <div>
                        <div className='px-4 py-6 sm:px-6 lg:px-10'>
                            <div className='flow-root'>
                                {
                                    allOrdersForUser && allOrdersForUser.length?
                                        <ul className='flex flex-col gap-4'>
                                            {
                                                allOrdersForUser.map((item) =>(
                                                    <li key={item._id} className='bg-white shadow p-5 flex-col space-y-3 py-6 text-left'>
                                                        <div className='flex'>
                                                            <h1 className='font-bold text-lg mb-3 flex-1'>
                                                                #Pedido: {item._id}
                                                            </h1>
                                                            <div className='flex items-center'>
                                                                <p className='mr-3 text-sm font-medium text-gray-900'>Monto total pagado</p>
                                                                <p className='mr-3 text-2xl font-semibold text-gray-900'>${item.totalPrice}</p>
                                                            </div>                                                            
                                                        </div>

                                                        <div className='flex gap-4'>
                                                            {
                                                                item.orderItems.map((orderItem, index) =>(
                                                                    <div key={index} className='shrink-0'>
                                                                        <img
                                                                            src={orderItem && orderItem.product.imageUrl}
                                                                            className='border h-24 w-24 max-w-full rounded-lg object-cover'
                                                                            alt='img pedido'
                                                                        />
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>

                                                        <div className='flex gap-4'>
                                                            <button
                                                                className="mt-5 mr-2 inline-block border border-gray-500 px-5 py-3
                                                                    text-xs font-medium uppercase tracking-wide
                                                                "
                                                            >
                                                                {
                                                                    item.isProcessing? 'Procesando pedido':'Enviando pedido a tu casa'
                                                                }
                                                            </button>
                                                            <button
                                                                className="mt-5 mr-2 inline-block bg-black text-white px-5 py-3
                                                                    text-xs font-medium uppercase tracking-wide
                                                                "
                                                                onClick={() => router.push(`/orders/${item._id}`)}
                                                            >
                                                                Ver detalles del pedido
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    :null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

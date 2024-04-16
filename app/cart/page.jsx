'use client'

import React, { useContext, useEffect } from 'react'
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import CommonCart from '../components/CommonCart/CommonCart'
import { GlobalContext } from '../context';
import { deleteFromCart, getAllCartItems } from '../services/cart/cart'

export default function Page() {
    const { 
        user,cartItems,setCartItems, 
        pageLevelLoader, setPageLevelLoader,
        componentLevelLoader, setComponentLevelLoader,
    } = useContext(GlobalContext);


    async function extractAllCartItems() {   
        setPageLevelLoader(true)     
        const res = await getAllCartItems(user.id);
        
        if (res.success) {
            const updatedData = res.data && res.data.length ?
            res.data.map((item) => (
                {
                    ...item,
                    productID:{
                        ...item.productID,
                        price: item.productID.onSale === 'yes'?
                            parseInt((
                                item.productID.price -
                                item.productID.price * (item.productID.priceDrop / 100)
                            ).toFixed(2))
                        :item.productID.price
                    }
                }
            ))
            :[]

            setCartItems(updatedData);
            localStorage.setItem("cartItems", JSON.stringify(updatedData));
            setPageLevelLoader(false)
        }
    }

    async function handleDeleteCartItem(getCartItemID){
        setComponentLevelLoader({loading: true, id: getCartItemID})
        
        const res = await deleteFromCart(getCartItemID)

        if(res.success){
            setComponentLevelLoader({loading: false, id: ''})
            toast.success(res.message)
            extractAllCartItems()
        }else{
            setComponentLevelLoader({loading: false, id: ''})
            toast.error(res.message)

        }
    }

    useEffect(() => {
        if (user !== null) extractAllCartItems();
    }, [user]);

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
        <div>
            <CommonCart cartItems={cartItems} handleDeleteCartItem={handleDeleteCartItem}
                componentLevelLoader={componentLevelLoader}
            />
        </div>
    )
}

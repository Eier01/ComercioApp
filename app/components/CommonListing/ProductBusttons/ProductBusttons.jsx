'use client'

import { GlobalContext } from '@/app/context'
import { addToCart } from '@/app/services/cart/cart'
import { deleteAProduct } from '@/app/services/product'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import React,{useContext} from 'react'
import { toast } from 'react-toastify'
import ComponentLevelLoader from '../../Loader/componentlevel/ComponentLevelLoader'

function ProductBusttons({item}) {

    const pathName = usePathname()
    const isAdminView = pathName.includes('admin-view')
    const router = useRouter()

    const {
        setCurrentUpdatedProduct,setComponentLevelLoader,
        componentLevelLoader,user,
        showCartModal,setShowCartModal
    } = useContext(GlobalContext)

    async function handleDeleteProduct(id){
        setComponentLevelLoader({ loading: true, id: id });
        const res = await deleteAProduct(id) 
        
        if (res.success) {
            setComponentLevelLoader({
                loding: false,
                id: id,
            });
            toast.success(res.message);
            router.refresh()
        } else {
            setComponentLevelLoader({
                loding: false,
                id: id,
            });
            toast.error(res.message);
        }
    }

    async function handleAddToCart(getItem){
        setComponentLevelLoader({ loading: true, id: getItem._id });

        const res = await addToCart({productID:getItem._id, userID:user.id})

        if(res.success){
            setComponentLevelLoader({loading:false, id:getItem._id})          
            toast.success(res.message);  
            setShowCartModal(true)
        }else{
            setComponentLevelLoader({loading:false, id:getItem._id})          
            toast.error(res.message);
            setShowCartModal(true)
        }
    }

    return isAdminView? <>
        <button className='mt-1.5 flex w-full justify-center bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide'
            onClick={() =>{
                setCurrentUpdatedProduct(item)
                router.push('/admin-view/add-product')
            }}
        >
            Editar
        </button>
        <button className='mt-1.5 flex w-full justify-center bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide'
            onClick={() => handleDeleteProduct(item._id)}
        >
            {
                componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id? 
                    <ComponentLevelLoader
                        text={'Eliminando producto'}
                        color={"#ffffff"}
                        loading={
                            componentLevelLoader &&
                            componentLevelLoader.loading
                        }
                    />:'Eliminar'
            }            
        </button>
    </>:<>
        <button className='mt-1.5 flex w-full justify-center bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide'
            onClick={() => handleAddToCart(item)}
        >
            {
                componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id?
                    <ComponentLevelLoader
                        text={'Agregando producto'}
                        color={"#ffffff"}
                        loading={
                            componentLevelLoader &&
                            componentLevelLoader.loading
                        }
                    />
                :'Agregar al carrito'
            }
        </button>
    </>
}

export default ProductBusttons
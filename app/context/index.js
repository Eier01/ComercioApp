'use client'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import {createContext,useState,useEffect} from 'react'

export const GlobalContext = createContext(null)

export const initialCheckoutFormData = {
    shippingAddress: {},
    paymentMethod: '',
    totalPrice: 0,
    isPaid: false,
    paidAt: new Date(),
    isProcessing: true,
} 

const protectedRoutes =[
    '/cart',
    '/checkout',
    '/account',
    '/orders',
    '/admin-view',
    '/admin-view/add-product',
    '/admin-view/all-products',
]

const protectedAdminRoutes =[
    '/admin-view',
    '/admin-view/add-product',
    '/admin-view/all-products',
]

export default function GlobalState({children}){
    const [showNavModal, setShowNavModal] = useState(false)
    const [pageLevelLoader, setPageLevelLoader] = useState(true)
    const [componentLevelLoader, setComponentLevelLoader] = useState({
        loading: false,
        id: ''
    })
    const [isAuthUser, setIsAuthUser] = useState(null)
    const [user, setUser] = useState(null)
    const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null)
    const [showCartModal, setShowCartModal] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [addresses, setAddresses] = useState([])
    const [allOrdersForUser, setAllOrdersForUser] = useState([])
    const [orderDetails, setOrderDetails] = useState(null)
    const [addressFormData, setAddressFormData] = useState({
        fullName: '',
        city: '',
        country: '',
        postalCode: '',
        address: '',
    })
    const [checkoutFormData, setCheckoutFormData] = useState(initialCheckoutFormData)

    const router = useRouter()
    const pathName = usePathname()


    useEffect(() =>{
        if(Cookies.get('token') !== undefined){
            setIsAuthUser(true)
            const userData = JSON.parse(localStorage.getItem('user') || {})
            const getCartItems = JSON.parse(localStorage.getItem('cartItems') || [1])
            setUser(userData)
            setCartItems(getCartItems)
        }else{
            setIsAuthUser(false)
            setUser({})
        }
    },[Cookies])

    useEffect(() =>{
        if(user && Object.keys(user).length === 0 && protectedRoutes.indexOf(pathName) > -1){
            router.push('/login')
        }

        if(user !== null && user && Object.keys(user).length !== 0 && user?.role !== 'admin' && protectedAdminRoutes.indexOf(pathName) > -1){
            router.push('/')
        }
    },[user,pathName])

    return(
        <GlobalContext.Provider
            value={{
                showNavModal,
                setShowNavModal,
                isAuthUser,
                setIsAuthUser,
                user,
                setUser,
                pageLevelLoader,
                setPageLevelLoader,
                componentLevelLoader,
                setComponentLevelLoader,
                currentUpdatedProduct,
                setCurrentUpdatedProduct,
                showCartModal,
                setShowCartModal,
                cartItems, 
                setCartItems,
                addresses, 
                setAddresses,
                addressFormData,
                setAddressFormData,
                checkoutFormData, 
                setCheckoutFormData,
                allOrdersForUser,
                setAllOrdersForUser,
                orderDetails, 
                setOrderDetails
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect,useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { GlobalContext } from "../context";
import { getAllAddress } from "../services/address/serviceAddress";
import { createNewOrder } from "../services/order/orderService";
import { callStripeSession } from "../services/stripe/stripe";

export default function Checkout() {
    const { user, cartItems, setCartItems, addresses, setAddresses, checkoutFormData, setCheckoutFormData } = useContext(GlobalContext);

    const [selectedAddress, setselectedAddress] = useState(null)
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)
    const [orderSuccess, setOrderSuccess] = useState(false)

    const router = useRouter()    
    const params = useSearchParams();

    async function extractAllAddress() {
        const res = await getAllAddress(user.id);

        if (res.success) {
            setAddresses(res.data);
        }
    }

    function handleSelectedAddress(getAddresses){

        if(getAddresses._id === selectedAddress){
            setselectedAddress(null)
            setCheckoutFormData({
                ...checkoutFormData,
                shippingAddress:{}
            })
            return
        }

        setselectedAddress(getAddresses._id)
        setCheckoutFormData({
            ...checkoutFormData,
            shippingAddress: {
                ...checkoutFormData.shippingAddress,
                fullName: getAddresses.fullName,
                city: getAddresses.city,
                country: getAddresses.country,
                postalCode: getAddresses.postalCode,
                address: getAddresses.address,
            }
        })
    }

    const publishablekey = 'pk_test_51P3KdLE2opcTCxpBDJGNqolbI2w4J5FIj5TEuhVpZt19EbKNVmgHhvYrMoBJDNMIelkDZnoKe8P3E8JxBCAlcylq00ckiH2nzW'
    const stripePromise = loadStripe(publishablekey)

    async function handleCheckout(){
        const stripe = await stripePromise;

        const createLineItems = cartItems.map((item) => ({
            price_data:{
                currency: 'usd',
                product_data: {
                    images: [item.productID.imageUrl],
                    name: item.productID.name,
                },
                unit_amount: item.productID.price*100
            },
            quantity:1,
        }))

        const res = await callStripeSession(createLineItems)

        if(res.success){
            setIsOrderProcessing(true)
            localStorage.setItem('stripe', true);
            localStorage.setItem('checkoutFormData', JSON.stringify(checkoutFormData));

            const {error} = await stripe.redirectToCheckout({
                sessionId: res.id
            })
        }else{
            toast.error(res.message)
        }
        
        
        
    }  
    

    useEffect(() => {
        if (user !== null) extractAllAddress();
    }, [user,extractAllAddress]);


    useEffect(() => {
        async function createFinalOrder(){
            const isStripe = JSON.parse(localStorage.getItem('stripe'))

            // Verificar si estamos en el cliente
            if (typeof window !== 'undefined') {
                const status = params?.get('status')

                if(isStripe && status === 'success' && cartItems && cartItems.length >0){
                    setIsOrderProcessing(true)
                    const getCheckoutFormData = JSON.parse(localStorage.getItem('checkoutFormData'))
    
                    const createFinalCheckoutFormData = {
                        user: user?.id,
                        shippingAddress: getCheckoutFormData.shippingAddress,
                        orderItems: cartItems.map((item) => ({
                            qty:1,
                            product:item.productID._id
                        })),
                        paymentMethod: 'Stripe',
                        totalPrice: cartItems.reduce((total,item) => item.productID.price + total,0),
                        isPaid: true,
                        paidAt: new Date(),
                        isProcessing:true,
                    }
    
                    const res = await createNewOrder(createFinalCheckoutFormData)
    
                    if(res.success){
                        setIsOrderProcessing(false)
                        setOrderSuccess(true)
                        toast.success(res.message)
                        setCartItems([])
                        localStorage.removeItem('stripe')
                        localStorage.removeItem('checkoutFormData')
                        localStorage.removeItem('cartItems')
                        
                    }else{
                        setIsOrderProcessing(false)
                        setOrderSuccess(false)
                        toast.error(res.message)
                        localStorage.removeItem('stripe')
                        localStorage.removeItem('checkoutFormData')
                    }
                }
            }
            
        }

        createFinalOrder()

    },[params?.get('status'),cartItems]);

    useEffect(() =>{
        if(orderSuccess){
            setTimeout(() =>{
                router.push('/orders')
            },[3000])
        }
    },[orderSuccess])

    if(orderSuccess){
        return(
            <section className="h-screen bg-gray-200">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                            <div className="bg-white shadow">
                                <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                                    <h1 className="font-bold text-xl">
                                        Tu pago fue echo exitosamente y en 3 segundos seras redirigido a la pagina donde veras tu pedido! 
                                    </h1>
                                    <button                               
                                        className="mt-5 mr-2 w-full inline-block bg-black text-white px-5 py-3
                                            text-xs font-medium uppercase tracking-wide
                                        "
                                        onClick={() => router.push('/orders')}
                                    >
                                    Ver tus pedidos
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
        )
    }

    if(isOrderProcessing){
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
            <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                <div className="px-4 pt-8">
                    <p className="font-medium text-xl">Resumen del carrito</p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
                        {cartItems && cartItems.length
                            ? cartItems.map((item) => (
                                  <div
                                      className="flex flex-col rounded-lg bg-white sm:flex-row"
                                      key={item._id}
                                  >
                                      <img
                                          src={
                                              item &&
                                              item.productID &&
                                              item.productID.imageUrl
                                          }
                                          alt="cart Item"
                                          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                                      />
                                      <div className="flex w-full flex-col px-4 py-4">
                                          <span className="font-bold">
                                              {item &&
                                                  item.productID &&
                                                  item.productID.name}
                                          </span>
                                          <span className="font-semibold">
                                              {item &&
                                                  item.productID &&
                                                  item.productID.price}
                                          </span>
                                      </div>
                                  </div>
                              ))
                            : "Tu carrito esta vacio"}
                    </div>
                </div>

                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <p className="text-xl font-medium">
                        Detalles de la direccion de envio
                    </p>
                    <p className="text-gray-400">
                        Completa tu orden seleccionando una direccion de envio
                    </p>

                    <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
                        {addresses && addresses.length ? (
                            addresses.map((item) => (
                                <div key={item._id} className={`border p-6 ${item._id === selectedAddress?'border-red-700':''}`}>
                                    <p>Nombre: {item.fullName}</p>
                                    <p>Direccion: {item.address}</p>
                                    <p>Ciudad: {item.city}</p>
                                    <p>Pais: {item.country}</p>
                                    <p>Codigo Postal: {item.postalCode}</p>
                                    <button
                                        className="mt-5 mr-2 inline-block bg-black text-white px-5 py-3
                                            text-xs font-medium uppercase tracking-wide
                                        "
                                        onClick={() => handleSelectedAddress(item)}
                                    >
                                        {item._id === selectedAddress?'Direccion seleccionada':'Seleccionar direccion'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No hay direcciones agregadas</p>
                        )}
                    </div>
                    <button
                        className="mt-5 mr-2 inline-block bg-black text-white px-5 py-3
                            text-xs font-medium uppercase tracking-wide
                    "
                    onClick={() => router.push('/account')}
                    >
                        Agregar nueva direccion
                    </button>
                    <div className="mt-6 border-t border-b py-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                                $
                                {cartItems && cartItems.length?
                                    cartItems.reduce((total,item) => item.productID.price + total,0)
                                :'0'
                                }
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Envio</p>
                            <p className="text-sm font-medium text-gray-900">Gratis</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                                $
                                {
                                    cartItems && cartItems.length?
                                        cartItems.reduce((total,item) => item.productID.price + total,0)
                                    :'0'
                                    
                                }
                            </p>
                        </div>
                        <div className="pb-10">
                            <button
                                disabled={
                                    (cartItems && cartItems.length === 0) ||
                                    Object.keys(checkoutFormData.shippingAddress).length === 0
                                }
                                className="disabled:opacity-50 mt-5 mr-2 w-full inline-block bg-black text-white px-5 py-3
                                    text-xs font-medium uppercase tracking-wide
                                "
                                onClick={handleCheckout}
                            >
                                Pagar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

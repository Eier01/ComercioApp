import { GlobalContext } from "@/app/context";
import { deleteFromCart, getAllCartItems } from "@/app/services/cart/cart";
import { useRouter } from "next/navigation";
import { Fragment, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import CommonModal from "../CommonModal/CommonModal";
import ComponentLevelLoader from "../Loader/componentlevel/ComponentLevelLoader";


export default function CartModal() {
    const { 
            showCartModal, setShowCartModal,
            user, cartItems, setCartItems, 
            setComponentLevelLoader,componentLevelLoader,
        } = useContext(GlobalContext);

    const router = useRouter() 

    async function extractAllCartItems() {
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

    function goToCart(){
        router.push('/cart')
        setShowCartModal(false)
    }

    useEffect(() => {
        if (user !== null) extractAllCartItems();
    }, [user]);

    return (
        <CommonModal
            show={showCartModal}
            setShow={setShowCartModal}
            mainContent={
                cartItems && cartItems.length ? (
                    <ul role="list" className="my-6 divide-y divide-gray-300">
                        {cartItems.map((item) => (
                            <li key={item._id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                        src={
                                            item &&
                                            item.productID &&
                                            item?.productID?.imageUrl
                                        }
                                        alt=""
                                        className="h-full w-full object-cover object-center"
                                    />
                                </div>
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>
                                                <a>
                                                    {item &&
                                                        item.productID &&
                                                        item.productID.name}
                                                </a>
                                            </h3>
                                        </div>
                                        <p>
                                            {item &&
                                                item.productID &&
                                                item.productID.price}
                                        </p>
                                    </div>

                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <button
                                            type="button"
                                            className="font-medium text-yellow-600 sm:order-2"
                                            onClick={() => handleDeleteCartItem(item._id)}
                                        >
                                            {
                                                componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id?
                                                    <ComponentLevelLoader
                                                        text={'Eliminando'}
                                                        color={"#ff7b5a"}
                                                        loading={
                                                            componentLevelLoader &&
                                                            componentLevelLoader.loading
                                                        }
                                                    />:'Eliminar'
                                            }
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : null
            }
            showButons={true}
            buttonComponent={
                <Fragment>
                    <button
                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3
                            text-xs font-medium uppercase tracking-wide
                        "
                        type="button"
                        onClick={() => goToCart()}
                    >
                        Ir al carrito
                    </button>
                    <button
                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3
                        text-xs font-medium uppercase tracking-wide disabled:opacity-50
                    "
                        type="button"
                        disabled={cartItems && cartItems.length === 0}
                        onClick={() => {
                            router.push('/checkout')
                            setShowCartModal(false)
                        }}
                    >
                        Pagar
                    </button>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
                        <button
                            type="button"
                            className="font-medium"
                            // onClick={()=> setShowCartModal(false)}
                        >
                            Continuar Comprando
                        </button>
                        <span className="ml-1">{'->'}</span>
                    </div>
                </Fragment>
            }
        />
    );
}

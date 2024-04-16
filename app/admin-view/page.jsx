"use client";
import React, { useState, useEffect, useContext } from "react";
import { SyncLoader } from "react-spinners";
import ComponentLevelLoader from "../components/Loader/componentlevel/ComponentLevelLoader";
import { GlobalContext } from "../context";
import { getAllOrdersForAllUser, updateStatusOfOrder } from "../services/order/orderService";

function AdminView() {
    const { user, pageLevelLoader, setPageLevelLoader,componentLevelLoader,setComponentLevelLoader } =
        useContext(GlobalContext);

    const [allOrdersForAllUser, setAllOrdersForAllUser] = useState([]);

    async function extractAllOrdersForAllUser() {
        setPageLevelLoader(true);
        const res = await getAllOrdersForAllUser();

        if (res.success) {
            setPageLevelLoader(false);
            setAllOrdersForAllUser(
                res.data && res.data.length
                    ? res.data.filter((item) => item.user._id !== user.id)
                    : []
            );
        } else {
            setPageLevelLoader(false);
        }
    }

    async function handleUpdateOrderStatus(getItem){
        setComponentLevelLoader({loading:true, id:getItem._id})
        const res = await updateStatusOfOrder({
            ...getItem,
            isProcessing: false
        })

        if(res.success){
            extractAllOrdersForAllUser()
        }

        setComponentLevelLoader({loading:false, id:''})

    }

    useEffect(() => {
        if (user !== null) extractAllOrdersForAllUser();
    }, [user]);

    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <SyncLoader
                    color={"#000000"}
                    loading={true}
                    size={27}
                    data-testid="loader"
                />
            </div>
        );
    }

    return (
        <section>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-6 lg:px-10">
                    <div className="flow-root">
                        {allOrdersForAllUser && allOrdersForAllUser.length ? (
                            <ul className="flex flex-col gap-4">
                                {allOrdersForAllUser.map((item) => (
                                    <li
                                        key={item._id}
                                        className="bg-gray-200 shadow p-5 flex-col space-y-3 py-6 text-left"
                                    >
                                        <div className="flex">
                                            <h1 className="font-bold text-lg mb-3 flex-1">
                                                #Pedido: {item._id}
                                            </h1>
                                            <div className="flex flex-col gap-2 pr-4">
                                                <h3 className="font-semibold">Informacion de envio</h3>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Ciudad:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.shippingAddress?.city}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Pais:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.shippingAddress?.country}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Codigo Posta:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.shippingAddress?.postalCode}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Direccion:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.shippingAddress?.address}
                                                    </p>
                                                </div>
                                            </div> 
                                            <div className="flex flex-col gap-2">
                                                <h3 className="font-semibold">Informacion del usuario</h3>

                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Nombre de usuario:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.user?.name}
                                                    </p>
                                                </div>

                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Correo electronico:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {item.user?.email}
                                                    </p>
                                                </div>

                                                <div className="flex items-center">
                                                    <p className="mr-3 text-sm font-medium text-gray-900">
                                                        Monto total pagado:
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        ${item?.totalPrice}
                                                    </p>
                                                </div>                                                
                                            </div>                                                                                      
                                        </div>                                        

                                        <div className="flex gap-4">
                                            {item.orderItems.map(
                                                (orderItem, index) => (
                                                    <div
                                                        key={index}
                                                        className="shrink-0"
                                                    >
                                                        <img
                                                            src={
                                                                orderItem &&
                                                                orderItem
                                                                    .product
                                                                    .imageUrl
                                                            }
                                                            className="border h-24 w-24 max-w-full rounded-lg object-cover"
                                                            alt="img pedido"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                className="mt-5 mr-2 inline-block border border-gray-500 px-5 py-3
                                                                    text-xs font-medium uppercase tracking-wide
                                                                "
                                            >
                                                {item.isProcessing
                                                    ? "Procesando pedido"
                                                    : "Enviando pedido a tu casa"}
                                            </button>
                                            <button
                                                disabled={!item.isProcessing}
                                                className="disabled:opacity-50 mt-5 mr-2 inline-block bg-black text-white px-5 py-3
                                                    text-xs font-medium uppercase tracking-wide
                                                " 
                                                onClick={() => handleUpdateOrderStatus(item)}                                              
                                            >
                                                {
                                                    componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id?
                                                    <ComponentLevelLoader
                                                        text={'Editando'}
                                                        color={"#ffffff"}
                                                        loading={
                                                            componentLevelLoader &&
                                                            componentLevelLoader.loading
                                                    }
                                                />
                                                    :'Editar estado del pedido'
                                                }
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminView;

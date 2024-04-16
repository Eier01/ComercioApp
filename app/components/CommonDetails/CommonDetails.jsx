"use client";
import { GlobalContext } from "@/app/context";
import { addToCart } from "@/app/services/cart/cart";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../Loader/componentlevel/ComponentLevelLoader";

function CommonDetails({ item }) {
    const {
        componentLevelLoader,
        setComponentLevelLoader,
        showCartModal,
        setShowCartModal,
        user,
    } = useContext(GlobalContext);

    async function handleAddToCart(getItem) {
        setComponentLevelLoader({ loading: true, id: getItem._id });

        const res = await addToCart({
            productID: getItem._id,
            userID: user.id,
        });

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: getItem._id });
            toast.success(res.message);
            setShowCartModal(true);
        } else {
            setComponentLevelLoader({ loading: false, id: getItem._id });
            toast.error(res.message);
            setShowCartModal(true);
        }
    }

    return (
        <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-12 mt-8 lg:col-gap-12 xl:col-gap-16 lg:mt-12 lg:grid-cols-5 lg:gap-16">
                    <div className="lg:col-span-3 lg:row-end-1">
                        <div className="lg:flex lg:items-start">
                            <div className="lg:order-2 lg:ml-5">
                                <div className="max-w-xl overflow-hidden rounded-lg bg-black">
                                    <img
                                        src={item.imageUrl}
                                        alt=""
                                        className="h-full w-full max-w-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="mt-2 w-full lg:order-1 lg:w-36 lg:flex-shrink-0">
                                <div className="flex flex-row items-start lg:flex-col">
                                    <button
                                        type="button"
                                        className="
                                            flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg
                                            border-2 border-gray-300 text-center
                                        "
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        className="
                                            flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg
                                            border-2 border-gray-300 text-center
                                        "
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {item && item.name}
                        </h1>
                        <div
                            className="mt-10 flex flex-col items-center justify-between space-x-4 border-t 
                            border-b py-4 sm:flex-row sm:space-y-0
                        "
                        >
                            <div className="flex items-end">
                                <h1
                                    className={`text-2xl font-bold ${
                                        item.onSale === "yes"
                                            ? "line-through"
                                            : ""
                                    }`}
                                >
                                    {item && item.price}
                                </h1>
                                {item.onSale === "yes" ? (
                                    <h1 className="mr-3 ml-2 text-2xl font-bold text-red-700">
                                        ${" "}
                                        {(
                                            item.price -
                                            item.price * (item.priceDrop / 100)
                                        ).toFixed(2)}
                                    </h1>
                                ) : null}
                            </div>
                            <button
                                type="buttom"
                                className="mt-2 inline-block bg-black px-5 py-3 text-xs font-medium 
                                    tracking-wide uppercase text-white
                                "
                                onClick={() => handleAddToCart(item)}
                            >
                                {componentLevelLoader &&
                                componentLevelLoader.loading &&
                                componentLevelLoader.id === item._id ? (
                                    <ComponentLevelLoader
                                        text={"Agregando producto"}
                                        color={"#ffffff"}
                                        loading={
                                            componentLevelLoader &&
                                            componentLevelLoader.loading
                                        }
                                    />
                                ) : (
                                    "Agregar al carrito"
                                )}
                            </button>
                        </div>
                        <ul className="mt-8 space-y-2">
                            <li className="flex items-center text-left text-sm font-medium text-gray-600">
                                {item && item.deliveryInfo}
                            </li>
                            <li className="flex items-center text-left text-sm font-medium text-gray-600">
                                Cancelar en cualquier momento
                            </li>
                        </ul>
                        <div className="lg:col-span-3">
                            <div className="border-b border-gray-400">
                                <nav className="flex gap-4">
                                    <a
                                        href="#"
                                        className="border-b border-gray-900 py-4 text-sm font-medium text-gray-900"
                                    >
                                        Descripcion
                                    </a>
                                </nav>
                            </div>
                            <div className="mt-8 flow-root sm:mt-12">
                                {item && item.description}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default CommonDetails;

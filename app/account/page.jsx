"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState, useEffect } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import InputComponent from "../components/FormElements/InputComponent/InputComponent";
import ComponentLevelLoader from "../components/Loader/componentlevel/ComponentLevelLoader";
import { GlobalContext } from "../context";
import {
    addNewAddress,
    deleteAddress,
    getAllAddress,
    updateAddress,
} from "../services/address/serviceAddress";
import { addNewAddressFormControls } from "../utils";

export default function page() {
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);

    const {
        user,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader, 
        setPageLevelLoader,
    } = useContext(GlobalContext);

    const router = useRouter()

    async function extractAllAddresses() {
        setPageLevelLoader(true)
        const res = await getAllAddress(user.id);

        if (res.success) {
            setPageLevelLoader(false)
            setAddresses(res.data);
        }
    }

    function handleUpdateAddress(getCurrentAddress) {
        setShowAddressForm(true);
        setAddressFormData({
            fullName: getCurrentAddress.fullName,
            city: getCurrentAddress.city,
            country: getCurrentAddress.country,
            postalCode: getCurrentAddress.postalCode,
            address: getCurrentAddress.address,
        });

        setCurrentEditedAddressId(getCurrentAddress._id);
    }

    async function handleDelete(getCurrentAddressId){
        setComponentLevelLoader({ loading: true, id: getCurrentAddressId});
        const res = await deleteAddress(getCurrentAddressId)

        if(res.success){
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            extractAllAddresses()
        }else{
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res.message);
        }
    }

    async function handleAddOrUpdateAddress() {
        setComponentLevelLoader({ loading: true, id: "" });
        const res =
            currentEditedAddressId !== null
                ? await updateAddress({
                        ...addressFormData,
                        _id: currentEditedAddressId,
                })
                : await addNewAddress({ ...addressFormData, userID: user?.id });

        if (res.success) {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.success(res.message);
            setAddressFormData({
                fullName: "",
                city: "",
                country: "",
                postalCode: "",
                address: "",
            });
            extractAllAddresses();
            setCurrentEditedAddressId(null)
        } else {
            setComponentLevelLoader({ loading: false, id: "" });
            toast.error(res.message);
            setAddressFormData({
                fullName: "",
                city: "",
                country: "",
                postalCode: "",
                address: "",
            });
        }
    }

    useEffect(() => {
        if (user !== null) extractAllAddresses();
    }, [user]);

    return (
        <section>
            <div className="bg-gray-100 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow">
                    <div className="p-6 sm:p-12">
                        <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
                            {/* Para renderizar una img */}
                        </div>
                        <div className="flex flex-col flex-1">
                            <h4 className="text-lg font-semibold text-center md:text-left">
                                {user?.name}
                            </h4>
                            <p>{user?.email}</p>
                            <p>{user?.role}</p>
                        </div>
                        <button
                            className="mt-5 inline-block bg-black text-white px-5 py-3
                                text-xs font-medium uppercase tracking-wide
                            "
                            onClick={() => router.push('/orders')}
                        >
                            Ver tus pedidos
                        </button>

                        <div className="mt-6">
                            <h1 className="font-bold text-lg">Tu direccion</h1>
                            {
                                pageLevelLoader?
                                <SyncLoader
                                    color={'#000000'}
                                    loading={true}
                                    size={15}
                                    data-testid="loader"
                                />
                                :(
                                    <div className="mt-4">
                                {addresses && addresses.length ? (
                                    addresses.map((item) => (
                                        <div
                                            className="border p-6"
                                            key={item._id}
                                        >
                                            <p>Nombre: {item.fullName}</p>
                                            <p>Direccion: {item.address}</p>
                                            <p>Ciudad: {item.city}</p>
                                            <p>Pais: {item.country}</p>
                                            <p>
                                                Codigo Postal: {item.postalCode}
                                            </p>
                                            <button
                                                className="mt-5 mr-2 inline-block bg-black text-white px-5 py-3
                                                    text-xs font-medium uppercase tracking-wide
                                                "
                                                onClick={() =>
                                                    handleUpdateAddress(item)
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="mt-5 inline-block bg-black text-white px-5 py-3
                                                    text-xs font-medium uppercase tracking-wide
                                                "
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                {
                                                    componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id?
                                                    <ComponentLevelLoader
                                                        text={"Eliminando"}
                                                        color={"#ffffff"}
                                                        loading={
                                                            componentLevelLoader &&
                                                            componentLevelLoader.loading
                                                        }
                                                    />:'Eliminar'
                                                }
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>
                                        No se encontraron direcciones! Porfavor
                                        agrega una direccion
                                    </p>
                                )}
                            </div>
                                )
                            }
                        </div>

                        <div className="mt-4">
                            <button
                                className="mt-5 inline-block bg-black text-white px-5 py-3
                                    text-xs font-medium uppercase tracking-wide
                                "
                                onClick={() =>
                                    setShowAddressForm(!showAddressForm)
                                }
                            >
                                {showAddressForm
                                    ? "Ocultar formulario"
                                    : "Agregar nueva direccion"}
                            </button>
                        </div>
                        {showAddressForm ? (
                            <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                                    {addNewAddressFormControls.map(
                                        (controlItem) => (
                                            <InputComponent
                                                type={controlItem.type}
                                                placeholder={
                                                    controlItem.placeholder
                                                }
                                                label={controlItem.label}
                                                value={
                                                    addressFormData[
                                                        controlItem.id
                                                    ]
                                                }
                                                onChange={(event) =>
                                                    setAddressFormData({
                                                        ...addressFormData,
                                                        [controlItem.id]:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        )
                                    )}
                                </div>
                                <div className="mt-4">
                                    <button
                                        className="mt-5 inline-block bg-black text-white px-5 py-3
                                        text-xs font-medium uppercase tracking-wide
                                    "
                                        onClick={handleAddOrUpdateAddress}
                                    >
                                        {componentLevelLoader &&
                                        componentLevelLoader.loading ? (
                                            <ComponentLevelLoader
                                                text={"Guardando"}
                                                color={"#ffffff"}
                                                loading={
                                                    componentLevelLoader &&
                                                    componentLevelLoader.loading
                                                }
                                            />
                                        ) : (
                                            "Guardar"
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

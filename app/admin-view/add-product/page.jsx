"use client";
import InputComponent from "@/app/components/FormElements/InputComponent/InputComponent";
import SelectComponent from "@/app/components/FormElements/SelectComponent/SelectComponent";
import TileComponent from "@/app/components/FormElements/TileComponent/TileComponent";
import {
    adminAddProductformControls,
    AvailableSizes,
    firebaseConfig,
    firebaseStorageUrl,
} from "@/app/utils";
import React, { useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable,
} from "firebase/storage";
import { addNewProduct, updateProduct } from "@/app/services/product";
import { GlobalContext } from "@/app/context";
import { toast } from "react-toastify";
import ComponentLevelLoader from "@/app/components/Loader/componentlevel/ComponentLevelLoader";
import { useRouter } from "next/navigation";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageUrl);

const initialFormData = {
    name: "",
    price: 0,
    name: "",
    description: "",
    category: "men",
    sizes: [],
    deliveryInfo: "",
    onSale: "no",
    imageUrl: "",
    priceDrop: "",
};

function AdminAddNewProduct() {
    const [formData, setformData] = useState(initialFormData);

    const router = useRouter();

    const {
        componentLevelLoader,
        setComponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
    } = useContext(GlobalContext);

    useEffect(() => {
        if (currentUpdatedProduct !== null) {
            setformData(currentUpdatedProduct);
        }
    }, [currentUpdatedProduct]);

    const createUniqueFileName = (getFile) => {
        const timeStamp = Date.now();
        const randomStringValue = Math.random().toString(36).substring(2, 12);

        return `${getFile.name}-${timeStamp}-${randomStringValue}`;
    };

    async function helperForUPloadingImageToFirebase(file) {
        const getFileName = createUniqueFileName(file);
        const storageReference = ref(storage, `ecommerce/${getFileName}`);
        const uploadImage = uploadBytesResumable(storageReference, file);

        return new Promise((resolve, reject) => {
            uploadImage.on(
                "state_changed",
                (snapShop) => {},
                (error) => {
                    console.log(error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadImage.snapshot.ref)
                        .then((dowloadUrl) => resolve(dowloadUrl))
                        .catch((error) => reject(error));
                }
            );
        });
    }

    async function handleImage(event) {
        const extractImageUrl = await helperForUPloadingImageToFirebase(
            event.target.files[0]
        );

        if (extractImageUrl !== "") {
            setformData({
                ...formData,
                imageUrl: extractImageUrl,
            });
        }
    }

    function handleTileClick(getCurrenItem) {
        let cpySizes = [...formData.sizes];
        const index = cpySizes.findIndex(
            (item) => item.id === getCurrenItem.id
        );

        if (index === -1) {
            cpySizes.push(getCurrenItem);
        } else {
            cpySizes = cpySizes.filter((item) => item.id !== getCurrenItem.id);
        }

        setformData({
            ...formData,
            sizes: cpySizes,
        });
    }

    async function handleAddProdct() {
        setComponentLevelLoader({ loading: true, id: "" });

        const res =
            currentUpdatedProduct !== null
                ? await updateProduct(formData)
                : await addNewProduct(formData);

        if (res.success) {
            setComponentLevelLoader({
                loding: false,
                id: "",
            });
            toast.success(res.message);
            setformData(initialFormData);
            setCurrentUpdatedProduct(null)
            setTimeout(() => {
                // router.push("/admin-view/all-products/?reload=true");
                router.push("/admin-view/all-products");
            }, 1000);
        } else {
            setComponentLevelLoader({
                loding: false,
                id: "",
            });
            toast.error(res.message);
            setformData(initialFormData);
        }
    }

    return (
        <div className="w-full mt-5 mr-0 mb-0 ml-0 relative">
            <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
                <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                    <input
                        accept="image/*"
                        max="1000000"
                        type="file"
                        onChange={handleImage}
                    />
                    <div className="flex gap-2 flex-col">
                        <label>Tamaños disponibles</label>
                        <TileComponent
                            data={AvailableSizes}
                            selected={formData.sizes}
                            onClick={handleTileClick}
                        />
                    </div>
                    {adminAddProductformControls.map((controlItem) =>
                        controlItem.componentType === "input" ? (
                            <InputComponent
                                type={controlItem.type}
                                placeholder={controlItem.placeholder}
                                label={controlItem.label}
                                value={formData[controlItem.id]}
                                onChange={(event) => {
                                    setformData({
                                        ...formData,
                                        [controlItem.id]: event.target.value,
                                    });
                                }}
                            />
                        ) : controlItem.componentType === "select" ? (
                            <SelectComponent
                                label={controlItem.label}
                                options={controlItem.options}
                                value={formData[controlItem.id]}
                                onChange={(event) => {
                                    setformData({
                                        ...formData,
                                        [controlItem.id]: event.target.value,
                                    });
                                }}
                            />
                        ) : null
                    )}
                    <button
                        className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                        text-white font-medium uppercase tracking-wide
                        "
                        disabled={componentLevelLoader.loading}
                        onClick={handleAddProdct}
                    >
                        {componentLevelLoader &&
                        componentLevelLoader.loading ? (
                            <ComponentLevelLoader
                                text={currentUpdatedProduct !== null? 'Editando producto':"Creando producto"}
                                color={"#ffffff"}
                                loading={
                                    componentLevelLoader &&
                                    componentLevelLoader.loading
                                }
                            />
                        ) : (
                            currentUpdatedProduct !== null? 'Editar producto':"Agregar producto"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminAddNewProduct;

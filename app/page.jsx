'use client'

import { useRouter } from "next/navigation";
import { useContext,useState,useEffect } from "react";
import { GlobalContext } from "./context";
import { getAllAdminProducts } from "./services/product";

export default function Home() {
  const {isAuthUser} = useContext(GlobalContext)

  const [products, setProducts] = useState([])

  const router = useRouter()

  async function getListOfProducts(){
    const res = await getAllAdminProducts()

    if(res.success){
      setProducts(res.data)
    }
  }

  useEffect(() =>{
    getListOfProducts()
  },[])

  console.log(products);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl ">
              Mejor coleccion de productos
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi quae aspernatur nisi maiores praesentium dolorem.
            </p>
            <div className="text-center">
              <button
              onClick={() => router.push('/product/listing/all-products')}
                type="button"
                className="bg-black mt-1 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
              >
                Empezar
              </button>
            </div>
          </div>

          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt=""
            />
          </div>
        </div>

        <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
            <div className="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
              <div className="max-w-md mx-auto text-center lg:text-left">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                    Coleccion de rebajas de verano
                  </h2>
                </div>

                <button
                  onClick={() => router.push('/product/listing/all-products')}
                  className="bg-black mt-2 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                >
                  Comprar todo
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 lg:py-8">
              <ul className="grid grid-cols-2 gap-4">
                {
                  products && products.length?
                    products.filter((item) => item.onSale === 'yes').splice(0,2).map((productItem) =>(
                      <li onClick={() => router.push(`/product/${productItem._id}`)} key={productItem._id} className="cursor-pointer">
                        <div>
                          <img
                            src={productItem.imageUrl}
                            alt=''
                            className="object-cover w-full rounded aspect-square"
                          />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-medium text-gray-900">{productItem.name}</h3>
                          <p className="mt-1 text-sm text-gray-800">{productItem.price}
                            <span className="text-red-800">{`(-${productItem.priceDrop})`}</span>
                          </p>
                        </div>
                      </li>
                    ))
                  :null
                }
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-950 sm:text-3xl">Compra por categoria</h2>
          </div>
          <ul className="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3">
            <li>
              <div className="relative block group">
                <img
                  src='https://images.unsplash.com/photo-1618898909019-010e4e234c55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                  className="object-cover w-full aspect-square"
                /> 
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium text-white">Niños</h3>
                  <button onClick={() => router.push('/product/listing/kids')} className="bg-black mt-2 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">Comprar ahora</button>
                </div>
              </div>
            </li>

            <li>
              <div className="relative block group">
                <img
                  src='https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                  className="object-cover w-full aspect-square"
                /> 
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium text-white">Mujeres</h3>
                  <button onClick={() => router.push('/product/listing/women')} className="bg-black mt-2 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">Comprar ahora</button>
                </div>
              </div>
            </li>

            

            <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="relative block group">
                <img
                  src='https://images.unsplash.com/photo-1593795899768-947c4929449d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80'
                  className="object-cover w-full aspect-square"
                /> 
                <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                  <h3 className="text-xl font-medium text-white">Hombres</h3>
                  <button 
                    onClick={() => router.push('/product/listing/men')}
                    className="bg-black mt-2 inline-block px-5 py-3 text-xs font-medium uppercase tracking-wide text-white"
                    >
                      Comprar ahora
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

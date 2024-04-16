'use client'
import { GlobalContext } from "@/app/context";
import { adminListing, navOptions } from "@/app/utils";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment,useContext,useEffect } from "react";
import CartModal from "../CartModal/CartModal";
import CommonModal from "../CommonModal/CommonModal";


function Navbar() {
    const {
        showNavModal, setShowNavModal, user,
        isAuthUser, setIsAuthUser, setUser,
        currentUpdatedProduct,setCurrentUpdatedProduct,
        showCartModal,setShowCartModal
    } = useContext(GlobalContext)

    const router = useRouter()

    const pathName = usePathname()    
    
    useEffect(() =>{
        if(pathName !== '/admin-view/add-product' && currentUpdatedProduct !== null){
            setCurrentUpdatedProduct(null)
        }
    },[pathName])

    function handleLogout(){
        setIsAuthUser(false)
        setUser(null)
        Cookies.remove('token')
        localStorage.clear()
        router.push('/')
    }

    const isAdminView = pathName.includes('admin-view')

    return (
        <>
            <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <div className="flex items-center cursor-pointer"
                        onClick={() => router.push('/')}
                    >
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">
                            ComercioApp
                        </span>
                    </div>
                    <div className="flex md:order-2 gap-2">
                        {!isAdminView && isAuthUser ? (
                            <Fragment>
                                <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                    onClick={() => router.push('/account')}
                                >
                                    Cuenta
                                </button>
                                <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                    onClick={() => setShowCartModal(true)}
                                >
                                    Carrito
                                </button>
                            </Fragment>
                        ) : null}
                        {user?.role === "admin" ? (
                            isAdminView ? (
                                <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                onClick={() => router.push('/')}
                                >
                                    Vista cliente
                                </button>
                            ) : (
                                <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                    onClick={() => router.push('/admin-view')}
                                >
                                    Vista Administrador
                                </button>
                            )
                        ) : null}
                        {isAuthUser ? (
                            <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                onClick={handleLogout}                                
                            >
                                Cerrar cesion
                            </button>
                        ) : (
                            <button className={"mt-2 inline-block bg-black px-3 py-2 text-xs font-medium uppercase tracking-wide text-white"}
                                onClick={() => router.push('/login')}
                            >
                                Iniciar sesion
                            </button>
                        )}
                        <button
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg 
                                md:hidden hover:bg-gray-100 focus:outline-none
                            "
                            aria-controls="navbar-sticky"
                            aria-expanded="false"
                            onClick={() => setShowNavModal(true)}
                        >
                            <span className="sr-only">Abrir Menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <NavItems isModalView={false} isAdminView={isAdminView} router={router}/>
                </div>                
            </nav>
            <CommonModal 
                showModalTitle={false}
                mainContent={<NavItems isModalView={true} isAdminView={isAdminView} router={router}/>}
                show={showNavModal} 
                setShow={setShowNavModal}
            />
            {
                showCartModal && 
                <CartModal/>
            }
        </>
    );
}

function NavItems({isModalView, isAdminView, router}) {
    return (
        <div
            className={`items-center justify-between w-full md:flex md:w-auto ${isModalView ? "":"hidden"}`}
            id="nav-items"
        >
            <ul
                className={`
                    flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg
                    md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white ${isModalView? '':'border border-gray-100'}
                `}
            >
                {isAdminView
                    ? adminListing.map((item) => (
                          <li
                              className="hover:bg-gray-100 cursor-pointer block py-2 pl-3 pr-3 text-gray-900 rounded md:p-0"
                              key={item.id}
                              onClick={() => router.push(item.path)}
                          >
                              {item.label}
                          </li>
                      ))
                    : navOptions.map((item) => (
                          <li
                              className="hover:bg-gray-100 cursor-pointer block py-2 pl-3 pr-3 text-gray-900 rounded md:p-0"
                              key={item.id}
                              onClick={() => router.push(item.path)}
                          >
                              {item.label}
                          </li>
                      ))}
            </ul>
        </div>
    );
}

export default Navbar;

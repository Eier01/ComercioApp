'use client'
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React,{useContext, useState, useEffect} from "react";
import InputComponent from "../components/FormElements/InputComponent/InputComponent";
import ComponentLevelLoader from "../components/Loader/componentlevel/ComponentLevelLoader";
import { GlobalContext } from "../context";
import { loginUser } from "../services/login/loginUser";
import { loginFormControls } from "../utils";
import { toast } from "react-toastify";

function Login() {
    const [formData, setformData] = useState({
        email:'',
        password:'',
    })

    const {
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
    } = useContext(GlobalContext)

    const router = useRouter()

    function isValidForm(){
        return formData && formData.email && formData.email.trim() !== ''
            && formData.password && formData.password.trim() !== '' ? true : false
    }

    async function handleLogin(){
        setComponentLevelLoader({
            loding: true,
            id: ''
        })

        const data = await loginUser(formData)

        if(data.success){
            toast.success(data.message)
            setIsAuthUser(true)
            setUser(data?.finalData?.user)
            setformData({ email:'',password:'',})
            Cookies.set('token', data?.finalData?.token)
            localStorage.setItem('user', JSON.stringify(data?.finalData?.user))
            setComponentLevelLoader({
                loding: false,
                id: ''
            })
        }else{
            toast.error(data.message)
            setIsAuthUser(false)
            setformData({ email:'',password:'',})
            setComponentLevelLoader({
                loding: false,
                id: ''
            })
        }
    }

    useEffect(() =>{
        if(isAuthUser) router.push("/")
    },[isAuthUser])

    return (
        <div className="bg-white relative">
            <div
                className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10
                mt-8 mr-auto  xl:px-5 lg:flex-row
            "
            >
                <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
                    <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
                        <div
                            className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10
                        bg-white shadow-2xl rounded-xl relative z-10"
                        >
                            <p className="w-full text-4xl font-medium text-center font-serif">
                                Iniciar Sesion
                            </p>
                            <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                {loginFormControls.map((controlItem,index) => (
                                    <InputComponent
                                        key={index}
                                        type={controlItem.type}
                                        placeholder={controlItem.placeholder}
                                        label={controlItem.label}
                                        value={formData[controlItem.id]}
                                        onChange={(ev) => {
                                            setformData({
                                                ...formData,
                                                [controlItem.id] : ev.target.value
                                            })
                                        }}
                                    />
                                ))}
                                <button
                                    className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black
                                            px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out
                                            focus:shadow font-medium uppercase tracking-wide"
                                    disabled={!isValidForm()}
                                    onClick={handleLogin}
                                >
                                    {
                                        componentLevelLoader && componentLevelLoader.loding? <ComponentLevelLoader
                                            text={'Iniciando sesion'}
                                            color={'#ffffff'}
                                            loading={componentLevelLoader && componentLevelLoader.loading}
                                        />:'Iniciar sesion'

                                    }
                                </button>
                                <div className="flex flex-col gap-2">
                                    <p>Nuevo en el sitio web?</p>
                                    <button
                                        className="inline-flex w-full items-center justify-center bg-black
                                            px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out
                                            focus:shadow font-medium uppercase tracking-wide"
                                        onClick={()=> router.push("/register")}
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
}

export default Login;

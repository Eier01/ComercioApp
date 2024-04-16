'use client'
import { useRouter } from "next/navigation";
import React,{useState,useContext,useEffect} from "react";
import InputComponent from "../components/FormElements/InputComponent/InputComponent";
import SelectComponent from "../components/FormElements/SelectComponent/SelectComponent";
import { GlobalContext } from "../context";
import { registerNewUser } from "../services/register/registerUser";
import { registrationFormControls } from "../utils/index";
import { toast } from "react-toastify";
import ComponentLevelLoader from "../components/Loader/componentlevel/ComponentLevelLoader";


const isRegistered = false;

const initialFormData = {
    name: '',
    email: '',
    password: '',
    role: 'customer',
}

function Register() {
    const [formData, setformData] = useState(initialFormData)
    const [isRegistered, setIsRegistered] = useState(false)

    const router = useRouter()

    const {componentLevelLoader,setComponentLevelLoader,isAuthUser} = useContext(GlobalContext)

    function isFormValid(){
        
        return formData && formData.name && formData.name.trim() !== '' 
        && formData.email && formData.email.trim() !== ''
        && formData.password && formData.password.trim() !== '' ? true : false

    }

    async function handleRegister(){
        setComponentLevelLoader({
            loding: true,
            id: ''
        })
        const data = await registerNewUser(formData)

        if(data.success){
            toast.success(data.message)
            setIsRegistered(true)
            setComponentLevelLoader({
                loding: false,
                id: ''
            })
            setformData(initialFormData)
        }else{
            toast.error(data.message)
            setComponentLevelLoader({
                loding: false,
                id: ''
            })
            setformData(initialFormData)            
        }
    }

    useEffect(() => {
        if (isAuthUser) router.push("/");
    }, [isAuthUser]);
    

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
                                {isRegistered
                                    ? "Registro exitoso"
                                    : "Registrarse"}
                            </p>
                            {isRegistered ? (
                                <button
                                    className="inline-flex w-full items-center justify-center bg-black
                                            px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out
                                            focus:shadow font-medium uppercase tracking-wide
                                        "
                                    onClick={()=> router.push("/login")}
                                >
                                    Iniciar sesion
                                </button>
                            ) : (
                                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                                    {registrationFormControls.map(
                                        (controlItem) =>
                                            controlItem.componentType ==
                                            "input" ? (
                                                <InputComponent
                                                    type={controlItem.type}
                                                    placeholder={
                                                        controlItem.placeholder
                                                    }
                                                    label={controlItem.label}
                                                    onChange={(ev) =>{
                                                        setformData({
                                                            ...formData,
                                                            [controlItem.id]: ev.target.value
                                                        })
                                                    }}
                                                    value={formData[controlItem.id]}
                                                />
                                            ) : controlItem.componentType ==
                                              "select" ? (
                                                <SelectComponent
                                                    options={
                                                        controlItem.options
                                                    }
                                                    label={controlItem.label}
                                                    onChange={(ev) =>{
                                                        setformData({
                                                            ...formData,
                                                            [controlItem.id]: ev.target.value
                                                        })
                                                    }}
                                                    value={formData[controlItem.id]}
                                                />
                                            ) : null
                                    )}
                                    <button
                                        className="disabled:opacity-50 inline-flex w-full items-center justify-center bg-black
                                            px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out
                                            focus:shadow font-medium uppercase tracking-wide"
                                        disabled={!isFormValid()}
                                        onClick={handleRegister}
                                    >
                                        {
                                            componentLevelLoader && componentLevelLoader.loding? <ComponentLevelLoader
                                            text={'Registrando'}
                                            color={'#ffffff'}
                                            loading={componentLevelLoader && componentLevelLoader.loading}
                                        />: 'Registrar'
                                        }
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;

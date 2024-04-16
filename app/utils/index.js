export const navOptions = [
    {
        id: "home",
        label: "Inicio",
        path: "/",
    },
    {
        id: "listing",
        label: "Todos los productos",
        path: "/product/listing/all-products",
    },
    {
        id: "listingMen",
        label: "Hombre",
        path: "/product/listing/men",
    },
    {
        id: "listingWomen",
        label: "Mujer",
        path: "/product/listing/women",
    },
    {
        id: "listingKids",
        label: "Niños",
        path: "/product/listing/kids",
    },
];

export const adminListing = [
    {
        id: "adminListing",
        label: "Administrar todos los productos",
        path: "/admin-view/all-products",
    },
    {
        id: "adminNewProduct",
        label: "Agregar nuevo producto",
        path: "/admin-view/add-product",
    },
];

export const registrationFormControls = [
    {
        id: "name",
        type: "text",
        placeholder: "Escribe tu nombre",
        label: "Nombre",
        componentType: "input",
    },
    {
        id: "email",
        type: "email",
        placeholder: "Escribe tu email",
        label: "Correo electronico",
        componentType: "input",
    },
    {
        id: "password",
        type: "password",
        placeholder: "Escribe tu contraseña",
        label: "Contraseña",
        componentType: "input",
    },
    {
        id: "role",
        type: "",
        placeholder: "",
        label: "Rol",
        componentType: "select",
        options: [
            {
                id: "admin",
                label: "Administrador",
            },
            {
                id: "customer",
                label: "Cliente",
            },
        ],
    },
];

export const loginFormControls = [
    {
        id: "email",
        type: "email",
        placeholder: "Escribe tu email",
        label: "Correo electronico",
        componentType: "input",
    },
    {
        id: "password",
        type: "password",
        placeholder: "Escribe tu contraseña",
        label: "Contraseña",
        componentType: "input",
    },
];

export const adminAddProductformControls = [
    {
        id: "name",
        type: "text",
        placeholder: "Ingresa el nombre",
        label: "Nombre",
        componentType: "input",
    },
    {
        id: "price",
        type: "number",
        placeholder: "Ingresa el precio",
        label: "Precio",
        componentType: "input",
    },
    {
        id: "description",
        type: "text",
        placeholder: "Ingresa la descripcion",
        label: "Descripcion",
        componentType: "input",
    },
    {
        id: "category",
        type: "",
        placeholder: "",
        label: "Categoria",
        componentType: "select",
        options: [
            {
                id: "men",
                label: "Hombre",
            },
            {
                id: "women",
                label: "Mujer",
            },
            {
                id: "kids",
                label: "Niños",
            },
        ],
    },
    {
        id: "deliveryInfo",
        type: "text",
        placeholder: "Ingres la informacion de entrega",
        label: "Informacion de entrega",
        componentType: "input",
    },
    {
        id: "onSale",
        type: "",
        placeholder: "",
        label: "En venta",
        componentType: "select",
        options: [
            {
                id: "yes",
                label: "Si",
            },
            {
                id: "no",
                label: "No",
            },
        ],
    },
    {
        id: "priceDrop",
        type: "number",
        placeholder: "Ingre descuento",
        label: "Descuento",
        componentType: "input",
    },
];

export const AvailableSizes = [
    {
        id:'s',
        label:'S',
    },
    {
        id:'m',
        label:'M',
    },
    {
        id:'l',
        label:'L',
    },
]

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDueOG9f7U9NdiMwTNjQYELjAbKNwN2FQo",
    authDomain: "nextjs-ecommerce-bdab6.firebaseapp.com",
    projectId: "nextjs-ecommerce-bdab6",
    storageBucket: "nextjs-ecommerce-bdab6.appspot.com",
    messagingSenderId: "1099248874274",
    appId: "1:1099248874274:web:6f13e54900af2b73db6b7b",
    measurementId: "G-FEQMPCBT16"
};

export const firebaseStorageUrl = 'gs://nextjs-ecommerce-bdab6.appspot.com' 

export const addNewAddressFormControls = [
    {
        id: 'fullName',
        type: 'input',
        placeholder: 'Escribe tu nombre completo',
        label: 'Nombre completo',
        componentType: "input",
    },
    {
        id: 'address',
        type: 'input',
        placeholder: 'Escribe tu direccion',
        label: 'Direccion',
        componentType: "input",
    },
    {
        id: 'city',
        type: 'input',
        placeholder: 'Escribe tu nombre ciudad',
        label: 'Ciudad',
        componentType: "input",
    },
    {
        id: 'country',
        type: 'input',
        placeholder: 'Escribe tu nombre pais',
        label: 'Pais',
        componentType: "input",
    },
    {
        id: 'postalCode',
        type: 'input',
        placeholder: 'Escribe tu nombre codigo postal',
        label: 'Codigo postal',
        componentType: "input",
    },
]
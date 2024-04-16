import React from 'react'
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from 'react-toastify'

function Notification() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            rtl={false}
        />
    )
}

export default Notification
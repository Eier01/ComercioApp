import CommonListing from '@/app/components/CommonListing/CommonListing'
import { getAllAdminProducts } from '@/app/services/product'
import React from 'react'

async function AdminView() {
    const allAdminProducts= await getAllAdminProducts()

    return (
        <div>
            <CommonListing data={allAdminProducts && allAdminProducts.data}/>
        </div>
    )
}

export default AdminView
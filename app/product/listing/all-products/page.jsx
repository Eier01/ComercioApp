import CommonListing from '@/app/components/CommonListing/CommonListing'
import { getAllAdminProducts } from '@/app/services/product'
import React from 'react'

async function AllProducts() {

    const getAllProducts = await getAllAdminProducts()

    return (
        <CommonListing data={getAllProducts && getAllProducts.data}/>
    )
}

export default AllProducts
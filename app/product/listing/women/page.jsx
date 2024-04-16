import CommonListing from '@/app/components/CommonListing/CommonListing'
import { getAllAdminProducts, productByCategory } from '@/app/services/product'
import React from 'react'

async function WomenAllProducts() {

    const getAllProducts = await productByCategory('women')

    return (
        <CommonListing data={getAllProducts && getAllProducts.data}/>
    )
}

export default WomenAllProducts
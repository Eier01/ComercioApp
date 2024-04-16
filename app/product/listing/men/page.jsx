import CommonListing from '@/app/components/CommonListing/CommonListing'
import { getAllAdminProducts, productByCategory } from '@/app/services/product'
import React from 'react'

async function MenAllProducts() {

    const getAllProducts = await productByCategory('men')

    return (
        <CommonListing data={getAllProducts && getAllProducts.data}/>
    )
}

export default MenAllProducts
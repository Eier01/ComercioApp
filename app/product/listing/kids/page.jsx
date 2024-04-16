import CommonListing from '@/app/components/CommonListing/CommonListing'
import {productByCategory } from '@/app/services/product'
import React from 'react'

async function KidsAllProducts() {

    const getAllProducts = await productByCategory('kids')

    return (
        <CommonListing data={getAllProducts && getAllProducts.data}/>
    )
}

export default KidsAllProducts
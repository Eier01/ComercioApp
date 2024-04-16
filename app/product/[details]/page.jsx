import CommonDetails from '@/app/components/CommonDetails/CommonDetails'
import { productById } from '@/app/services/product'
import React from 'react'

async function ProductDetails({params}) {

    const productDetailsData = await productById(params.details)
    
    return (
        <div>
            <CommonDetails item={productDetailsData.data}/>
        </div>
    )
}

export default ProductDetails
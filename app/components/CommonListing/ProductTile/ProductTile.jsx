"use client";
import React from "react";

function ProductTile({ item }) {
    return (
        <div>
            <div className="overflow-hidden h-full w-full">
                <img
                    src={item.imageUrl}
                    alt=""
                    className="object-cover h-48 w-96 transition-all duration-300 group-hover:scale-125"
                />
                {item.onSale === "yes" ? (
                    <div className="absolute top-2 m-2 rounded-full bg-black">
                        <p
                            className="rounded-full p-1 text-[8px] font-bold uppercase tracking-wide
                            text-white sm:py-1 sm:px-3
                        "
                        >
                            sale
                        </p>
                    </div>
                ) : null}
                <div className="my-4 mx-auto flex w-10/12 flex-col items-start justify-between">
                    <div className="mb-2 flex">
                        <p
                            className={`mr-3 text-sm font-semibold ${
                                item.onSale === "yes" ? "line-through" : ""
                            }`}
                        >
                            $ {item.price}
                        </p>
                        {item.onSale === "yes" ? (
                            <p className="mr-3 text-sm font-semibold text-red-700">
                                ${" "}
                                {(
                                    item.price -
                                    item.price * (item.priceDrop / 100)
                                ).toFixed(2)}
                            </p>
                        ) : null}
                        {item.onSale === "yes" ? (
                            <p className="mr-3 text-sm font-semibold">
                                {`- (${item.priceDrop}%) off`}
                            </p>
                        ) : null}
                    </div>
                    <h3 className="text-gray-400 text-sm">{item.name}</h3>
                </div>
            </div>
        </div>
    );
}

export default ProductTile;

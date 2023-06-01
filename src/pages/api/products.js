import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";
import mongoose from "mongoose";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if(method === 'POST') {
        const {name, description, price} = req.body;
        const ProductDoc = await Product.create({
            name, description, price
        })
        res.json(ProductDoc)
    }
}
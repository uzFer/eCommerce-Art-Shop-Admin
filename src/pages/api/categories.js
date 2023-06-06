import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if(method === 'GET') {
        res.json(await Category.find());
    }

    if(method === 'POST') {
        const {name, parentCategory} = req.body; 
        const productDoc = await Category.create({
            name, 
            parent: parentCategory,
        });
        res.json(productDoc)
    }
}
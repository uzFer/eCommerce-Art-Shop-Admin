import clientPromise from "@/lib/mongodb";
import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if(method === 'POST') {
        const {name} = req.body; 
        const productDoc = await Category.create({
            name
        });
        res.json(productDoc)
    }
}
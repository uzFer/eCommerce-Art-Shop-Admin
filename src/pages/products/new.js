import Layout from "@/components/Layout";
import { useState } from "react";

export default function NewProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    return (
        <Layout>
            <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
            <label>Product Name</label>
            <input type="text" 
                placeholder="Product Name"
                value={name}
                onChange={e =>(e.target.value)}
            />
            <label>Brief Description of Product</label>
            <textarea placeholder="Description">
            </textarea>
            <label>Price (in CAD)</label>
            <input type="number" 
                placeholder="Price"
            />
            <button className="primary-btn">Save</button>
        </Layout>
    );
}
import Layout from "@/components/Layout";
import axios from "axios";
import { Router } from "next/router";
import { useState } from "react";

export default function NewProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function createProduct(e) {
        e.preventDefault();
        const data = {name, description, price};
        await axios.post('/api/products', data);
        setGoToProducts(true)
    }

    if(goToProducts) {
        router.push('/products');
    }

    return (
        <Layout>
            <form onSubmit={createProduct}>
            <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
            <label>Product Name</label>
            <input type="text" 
                placeholder="Product Name"
                value={name}
                onChange={e => setName(e.target.value)} />

            <label>Brief Description of Product</label>
            <textarea 
                placeholder="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}>
            </textarea>

            <label>Price (in CAD)</label>
            <input type="number" 
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)} />
            <button type="submit" className="primary-btn">Save</button>
            </form>
        </Layout>
    );
}
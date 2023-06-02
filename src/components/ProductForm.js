import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({_id, name: currName, description: currDescription, price: currPrice, images}) {
    const [name, setName] = useState(currName || '');
    const [description, setDescription] = useState(currDescription || '');
    const [price, setPrice] = useState(currPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();

    async function saveProduct(e) {
        e.preventDefault();
        const data = {name, description, price};

        if(_id) {
            // update the product
            await axios.put('/api/products', {...data, _id});
        }
        else {
            // create the product
            await axios.post('/api/products', data);
        }
        setGoToProducts(true)
    }

    async function uploadImage(e) {
        const files = e.target?.files;

        if(files?.length > 0) {
            const data = new FormData();
            
            files.forEach(file => data.append('file', file));
            const res = await axios.post('/api/upload', data);
        }
    }

    if(goToProducts) {
        router.push('/products');
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" 
                placeholder="Product Name"
                value={name}
                onChange={e => setName(e.target.value)} />

            <label>Photos</label>
            <div className="mb-2">
                <label className="w-32 h-32 bg-gray-300 cursor-pointer text-center flex flex-col items-center justify-center gap-1 text-sm text-gray-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImage}></input>
                </label>
            
                {!images?.length && (
                    <div>No photos for this product</div>
                )}
            </div>

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
    );
}
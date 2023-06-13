import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
    _id, 
    name: currName, 
    description: currDescription, 
    price: currPrice, 
    images: currImages,
    category: currCategory,
    properties: currProperties,
}) { 
    const [name, setName] = useState(currName || '');
    const [description, setDescription] = useState(currDescription || '');
    const [price, setPrice] = useState(currPrice || '');
    const [images, setImages] = useState(currImages || []);
    const [isUploading, setisUploading] = useState(false);
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(currCategory || '');
    const [productProperties, setProductProperties] = useState(currProperties || {});
    const router = useRouter();

    async function saveProduct(e) {
        e.preventDefault();
        const data = {
            name, description, price, images, category, 
            properties: productProperties
        };

        if(_id) {
            // update the product
            await axios.put('/api/products', {...data, _id});
        }
        else {
            // create the product
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    async function uploadImage(e) {
        const files = e.target?.files;

        if(files?.length > 0) {
            setisUploading(true);
            const data = new FormData();
            
            for(const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setisUploading(false);
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
    }

    if(goToProducts) {
        router.push('/products');
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category)
        propertiesToFill.push(...catInfo.properties);

        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    function setProductProperty(propertyName, value) {
        setProductProperties(prev => {
            const newProductProperties = {...prev};
            newProductProperties[propertyName] = value;
            return newProductProperties;
        })
    }

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, []);


    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type="text" 
                placeholder="Product Name"
                value={name}
                onChange={e => setName(e.target.value)} />

            <label>Category</label>
            <select value={category}
                    onChange={e => setCategory(e.target.value)}>
                <option value="">No category</option>
                {categories.length > 0 && categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div className="" key={p.name}>
                    <label key={p} className="text-white">{p.name[0].toUpperCase() + p.name.substring(1)} </label>
                    <div>
                        <select 
                            value={productProperties[p.name]}
                            onChange={e => setProductProperty(p.name, e.target.value)}>
                            {p.values.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable className="flex flex-wrap gap-1" list={images} setList={updateImagesOrder}>
                {!!images?.length && images.map(link => (
                    <div key={link} className="h-32 bg-dark p-2">
                        <img src={link} alt="" className="rounded-md"></img>
                    </div>
                ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-32 flex items-center p-4">
                        <Spinner />
                    </div>
                )}
                <label className="w-32 h-32 bg-gray-100 shadow-md cursor-pointer text-center flex flex-col items-center justify-center gap-1 text-sm text-gray-500 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className="hidden" onChange={uploadImage}></input>
                </label>
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
            <button type="submit" className="primary-btn hover:text-black hover:bg-primary transition-all">Save</button>
        </form>
    );
}
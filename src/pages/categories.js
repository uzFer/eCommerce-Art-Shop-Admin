import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
    const [name, setName] = useState(''); 
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories', {name, parentCategory});
        setName('');
        fetchCategories();
    }

    function fetchCategories()  {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>New Category Name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder={'Category name'}
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <select 
                    className="mb-0"
                    onChange={e => setParentCategory(e.target.value)}
                    value={parentCategory}
                >
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id} key={category}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit" className="primary-btn py-1">Save</button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category}>
                            <td>{category.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
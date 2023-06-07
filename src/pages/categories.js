import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [name, setName] = useState(''); 
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);

    async function saveCategory(e) {
        e.preventDefault();
        const data = {name, parentCategory};

        if(editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else {
            await axios.post('/api/categories', data);
        }
        
        setParentCategory('');
        setName('');
        fetchCategories();
    }

    function fetchCategories()  {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${category.name}"?`,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            reverseButtons: true,
            confirmButtonColor: '#d55',
        }).then(async result => {
            if(result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category "${editedCategory.name}"` : 'Create New Category'}</label>
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
                        <option value={category._id} key={category._id}>
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
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="flex flex-">
                                <button 
                                    onClick={() => editCategory(category)} 
                                    className="primary-btn mr-1">
                                    Edit
                                </button>
                                <button 
                                    onClick={() => deleteCategory(category)} 
                                    className="primary-btn">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));
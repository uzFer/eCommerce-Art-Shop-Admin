import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [name, setName] = useState(''); 
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
    const [editedCategory, setEditedCategory] = useState(null);

    async function saveCategory(e) {
        e.preventDefault();
        const data = {
            name, 
            parentCategory, 
            properties: properties.map(p => ({
                name: p.name, 
                values: p.values.split(','),
            })),
        };

        if(editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else {
            await axios.post('/api/categories', data);
        }
        
        setParentCategory('');
        setProperties([]);
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
        setProperties(category.properties.map(({name, values}) => ({
            name,
            values: values.join(',')
        }))
        );
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${category.name}"?`,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Yes',
            confirmButtonColor: '#d55',
        }).then(async result => {
            if(result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    };

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, i) => {
                return i !== indexToRemove;
            });
        });
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory 
                ? `Edit Category "${editedCategory.name}"` 
                : 'Create New Category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1 mb-5">
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
                </div>
                <div className="mb-5">
                    <label className="block mb-1">Properties</label>
                    <button 
                        type="button"
                        className="secondary-btn text-sm mb-2 hover:text-dark hover:bg-gray-500 transition-all"
                        onClick={addProperty}
                    >
                        Add new property
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={property} className="flex gap-1 mb-2">
                            <input 
                                type="text" 
                                className="mb-0"
                                onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                placeholder="Property Name"
                                value={property.name}
                            />
                            <input 
                                type="text" 
                                className="mb-0"
                                onChange={e => handlePropertyValuesChange(index, property, e.target.value)}
                                placeholder="Values, comma separated"
                                value={property.values}
                            />
                            <button 
                                className="btn-default hover:text-red hover:bg-pink transition-all"
                                type="button"
                                onClick={e => removeProperty(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-1">
                    <button 
                        type="submit" 
                        className="primary-btn py-1 hover:text-black hover:bg-primary transition-all">
                        Save
                    </button>
                    {editedCategory && (
                        <button 
                            type="button"
                            onClick={() => {
                                setEditedCategory(null);
                                setName('');
                                setParentCategory('');
                                setProperties([]);
                            }}
                            className="btn-default hover:text-red hover:bg-pink transition-all">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {!editedCategory && 
                <table className="basic mt-10">
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
                                        className="secondary-btn mr-2 hover:text-dark hover:bg-gray-500 transition-all">
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => deleteCategory(category)} 
                                        className="btn-default hover:text-red hover:bg-pink transition-all">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
));
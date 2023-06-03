import Layout from "@/components/Layout";

export default function Categories() {
    const [name, setName] = useState('');

    function saveCategory() {

    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>New Category Name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="mb-0" 
                    type="text" 
                    placeholder={'Category name'}
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                <button type="submit" className="primary-btn py-1">Save</button>
            </form>
        </Layout>
    );
}
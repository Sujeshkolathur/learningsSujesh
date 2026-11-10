import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/seedData';
import { formatCurrency } from '../../utils/format';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'Chair',
  images: '',
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
      images: product.images.join('\n'),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }
    resetForm();
  }

  return (
    <div>
      <h1 className="page-title">Product management</h1>

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit product' : 'Add product'}</h2>
        <div className="field-row">
          <input className="input" required placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <textarea className="input" required rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="field-row">
          <input className="input" required type="number" min="0" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" required type="number" min="0" placeholder="Stock quantity" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <textarea className="input" rows={2} placeholder="Image URLs (one per line)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <div className="form-actions">
          <button type="submit" className="btn">{editingId ? 'Update' : 'Add product'}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="table-product">
                    <img src={p.images[0]} alt="" />
                    {p.name}
                  </div>
                </td>
                <td>{p.category}</td>
                <td>{formatCurrency(p.price)}</td>
                <td className={p.stock === 0 ? 'out-stock' : ''}>{p.stock}</td>
                <td className="actions-cell">
                  <button type="button" className="link-btn" onClick={() => startEdit(p)}>Edit</button>
                  <button type="button" className="link-btn danger" onClick={() => { if (confirm('Delete product?')) deleteProduct(p.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

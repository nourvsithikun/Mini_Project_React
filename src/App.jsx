import { useState } from 'react'
import {
  useCreateNewProductMutation,
  useDeleteProductByUUIDMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
  useGetAllSuppliersQuery,
  useUpdateProductByUUIDMutation,
} from './services/product'
import './App.css'

const emptyForm = {
  name: '',
  description: '',
  stockQuantity: 0,
  priceIn: '',
  priceOut: '',
  discount: 0,
  thumbnail: '',
  warranty: '',
  availability: true,
  categoryUuid: '',
  supplierUuid: '',
  brandUuid: '',
}

const errorMessage = (error) =>
  error?.data?.error?.description || error?.data?.message || error?.error || 'Request failed'

function ProductForm({ product, onClose }) {
  const [form, setForm] = useState(() =>
    product
      ? {
          ...emptyForm,
          name: product.name || '',
          description: product.description || '',
          stockQuantity: product.stockQuantity ?? 0,
          priceIn: product.priceIn ?? product.priceOut ?? '',
          priceOut: product.priceOut ?? '',
          discount: product.discount ?? 0,
          thumbnail: product.thumbnail || '',
          warranty: product.warranty || '',
          availability: product.availability ?? true,
          categoryUuid: product.category?.uuid || '',
          supplierUuid: product.supplier?.uuid || '',
          brandUuid: product.brand?.uuid || '',
        }
      : emptyForm,
  )
  const [message, setMessage] = useState('')
  const [createNewProduct, createState] = useCreateNewProductMutation()
  const [updateProductByUUID, updateState] = useUpdateProductByUUIDMutation()
  const { data: brands } = useGetAllBrandsQuery()
  const { data: categories } = useGetAllCategoriesQuery()
  const { data: suppliers } = useGetAllSuppliersQuery()
  const busy = createState.isLoading || updateState.isLoading

  const change = ({ target }) => {
    const value = target.type === 'checkbox' ? target.checked : target.value
    setForm((current) => ({ ...current, [target.name]: value }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setMessage('')
    const body = {
      ...form,
      stockQuantity: Number(form.stockQuantity),
      priceIn: Number(form.priceIn),
      priceOut: Number(form.priceOut),
      discount: Number(form.discount),
      color: product?.color || [],
      images: product?.images || [],
    }
    try {
      if (product) {
        await updateProductByUUID({
          uuid: product.uuid,
          updatedProduct: body,
        }).unwrap()
      } else {
        await createNewProduct({ newProduct: body }).unwrap()
      }
      onClose()
    } catch (error) {
      setMessage(errorMessage(error))
    }
  }

  const options = (data) => data?.content || []

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div><span className="eyebrow">PRODUCT FORM</span><h2>{product ? 'Update product' : 'Create product'}</h2></div>
          <button className="icon-button" type="button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label className="wide">Product name<input name="name" value={form.name} onChange={change} required /></label>
            <label>Price in ($)<input name="priceIn" type="number" min="0.01" step="0.01" value={form.priceIn} onChange={change} required /></label>
            <label>Price out ($)<input name="priceOut" type="number" min="0.01" step="0.01" value={form.priceOut} onChange={change} required /></label>
            <label>Stock<input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={change} required /></label>
            <label>Discount (%)<input name="discount" type="number" step="0.01" value={form.discount} onChange={change} /></label>
            {!product && <label>Category<select name="categoryUuid" value={form.categoryUuid} onChange={change} required><option value="">Select category</option>{options(categories).map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></label>}
            <label>Brand<select name="brandUuid" value={form.brandUuid} onChange={change} required><option value="">Select brand</option>{options(brands).map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></label>
            {!product && <label className="wide">Supplier<select name="supplierUuid" value={form.supplierUuid} onChange={change} required><option value="">Select supplier</option>{options(suppliers).map((item) => <option key={item.uuid} value={item.uuid}>{item.name}</option>)}</select></label>}
            <label className="wide">Thumbnail URL<input name="thumbnail" type="url" value={form.thumbnail} onChange={change} /></label>
            <label>Warranty<input name="warranty" value={form.warranty} onChange={change} /></label>
            <label className="check"><input name="availability" type="checkbox" checked={form.availability} onChange={change} /> Available</label>
            <label className="wide">Description<textarea name="description" rows="4" value={form.description} onChange={change} /></label>
          </div>
          {message && <p className="form-error">{message}</p>}
          <div className="form-actions"><button className="secondary" type="button" onClick={onClose}>Cancel</button><button type="submit" disabled={busy}>{busy ? 'Saving…' : product ? 'Save changes' : 'Create product'}</button></div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const { data, isLoading, isFetching, error, refetch } = useGetAllProductsQuery({ page, size: 8, name: query })
  const [deleteProductByUUID, deleteState] = useDeleteProductByUUIDMutation()

  const searchProducts = (event) => {
    event.preventDefault()
    setPage(0)
    setQuery(search.trim())
  }

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) return
    setNotice('')
    try {
      await deleteProductByUUID({ uuid: product.uuid }).unwrap()
      setNotice('Product deleted successfully.')
    } catch (requestError) {
      setNotice(errorMessage(requestError))
    }
  }

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (product) => { setEditing(product); setFormOpen(true) }

  return (
    <main>
      <header>
        <div><span className="eyebrow">RTK QUERY · KUNZZ</span><h1>Product Management</h1><p>Create, read, update, and delete products.</p></div>
        <button onClick={openCreate}>+ Add product</button>
      </header>

      <section className="toolbar">
        <form onSubmit={searchProducts}><input aria-label="Search products" placeholder="Search by product name…" value={search} onChange={(event) => setSearch(event.target.value)} /><button type="submit" className="secondary">Search</button></form>
        <span>{isFetching ? 'Refreshing…' : `${data?.totalElements ?? 0} products`}</span>
      </section>

      {notice && <div className="notice">{notice}</div>}
      {isLoading && <div className="state">Loading products…</div>}
      {error && <div className="state error"><p>{errorMessage(error)}</p><button onClick={refetch}>Try again</button></div>}
      {!isLoading && !error && data?.content?.length === 0 && <div className="state">No products found.</div>}

      <section className="product-grid">
        {data?.content?.map((product) => (
          <article key={product.uuid}>
            <div className="image-wrap">
              {product.thumbnail ? <img src={product.thumbnail} alt={product.name} onError={(event) => { event.currentTarget.style.display = 'none' }} /> : <span>No image</span>}
              <span className={`status ${product.availability ? 'available' : ''}`}>{product.availability ? 'Available' : 'Unavailable'}</span>
            </div>
            <div className="card-body">
              <div className="meta">{product.brand?.name || 'No brand'} · {product.category?.name || 'No category'}</div>
              <h2>{product.name}</h2>
              <p className="description">{product.description || 'No description provided.'}</p>
              <div className="product-info"><strong>${Number(product.priceOut || 0).toFixed(2)}</strong><span>{product.stockQuantity} in stock</span></div>
              <div className="card-actions"><button className="secondary" onClick={() => openEdit(product)}>Edit</button><button className="danger" disabled={deleteState.isLoading} onClick={() => remove(product)}>Delete</button></div>
            </div>
          </article>
        ))}
      </section>

      {data && data.totalPages > 1 && <nav className="pagination" aria-label="Product pages"><button className="secondary" disabled={data.first} onClick={() => setPage((value) => value - 1)}>← Previous</button><span>Page {data.number + 1} of {data.totalPages}</span><button className="secondary" disabled={data.last} onClick={() => setPage((value) => value + 1)}>Next →</button></nav>}
      {formOpen && <ProductForm key={editing?.uuid || 'new'} product={editing} onClose={() => setFormOpen(false)} />}
    </main>
  )
}

export default App

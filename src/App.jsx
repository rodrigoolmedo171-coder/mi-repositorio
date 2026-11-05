import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'https://fakestoreapi.com/products'
const money = new Intl.NumberFormat('es-PY', { style: 'currency', currency: 'USD' })

function App() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cartCount, setCartCount] = useState(0)

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('No pudimos cargar los productos.')
      const data = await response.json()
      setProducts(data)
    } catch {
      setError('No pudimos conectar con Fake Store API. Revisa tu conexión e inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  const categories = useMemo(() => ['Todos', ...new Set(products.map((product) => product.category))], [products])
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category
    const matchesQuery = product.title.toLowerCase().includes(query.trim().toLowerCase())
    return matchesCategory && matchesQuery
  }), [products, category, query])

  return (
    <div className="storefront">
      <div className="announcement">Envío gratis en compras mayores a $75 <span>✦</span> Nuevas piezas cada semana</div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="NOVA, inicio"><span className="brand-mark">N</span><span>NOVA<span className="brand-dot">.</span></span></a>
        <nav aria-label="Navegación principal"><a className="nav-active" href="#catalogo">Tienda</a><a href="#catalogo">Colecciones</a><a href="#nosotros">Nosotros</a></nav>
        <button className="cart-button" type="button" aria-label={`Carrito, ${cartCount} productos`}><span className="bag-icon">▱</span><span className="cart-label">Carrito</span><span className="cart-count">{cartCount}</span></button>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> OBJETOS PARA TODOS LOS DÍAS</p>
            <h1>Lo simple<br />se siente <em>mejor.</em></h1>
            <p className="hero-description">Diseño pensado para acompañarte. Encuentra esas piezas que hacen que cada día se sienta un poco más tuyo.</p>
            <a className="primary-button" href="#catalogo">Explorar colección <span>↗</span></a>
            <div className="hero-note"><span className="note-star">✳</span><span>DISEÑO CON INTENCIÓN<br /><strong>Hecho para durar</strong></span></div>
          </div>
          <div className="hero-art" aria-label="Selección de objetos de diseño" role="img">
            <div className="sun-disc" /><div className="art-caption">ESTUDIO / 026</div>
            <div className="art-plant"><i /><i /><i /><i /><i /><b /></div>
            <div className="art-vase vase-tall"><span /></div><div className="art-vase vase-small"><span /></div>
            <div className="art-book book-one" /><div className="art-book book-two" /><div className="art-table" />
            <div className="art-stamp">FORMA<br />Y FUNCIÓN<span>✳</span></div>
          </div>
          <div className="hero-index"><span>01</span><span className="index-rule" /><span>03</span></div>
        </section>

        <section className="catalog" id="catalogo">
          <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> SELECCIÓN CURADA</p><h2>Encuentra tu <em>favorito.</em></h2></div><p className="catalog-intro">Piezas pequeñas, ideas grandes.<br />Todo lo que necesitas, nada que no.</p></div>
          <div className="catalog-toolbar">
            <div className="category-list" aria-label="Filtrar por categoría">{categories.map((item) => <button type="button" key={item} className={category === item ? 'category-chip selected' : 'category-chip'} onClick={() => setCategory(item)}>{item === 'Todos' ? item : item.replace(/\b\w/g, (letter) => letter.toUpperCase())}</button>)}</div>
            <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar piezas..." aria-label="Buscar productos" /></label>
          </div>

          {loading && <div className="status-message"><span className="loader" /> Cargando piezas para ti...</div>}
          {error && <div className="status-message error-message"><p>{error}</p><button className="retry-button" onClick={loadProducts}>Intentar de nuevo ↗</button></div>}
          {!loading && !error && visibleProducts.length === 0 && <div className="status-message">No encontramos piezas con esa búsqueda.</div>}
          {!loading && !error && visibleProducts.length > 0 && <div className="product-grid">{visibleProducts.map((product, index) => <article className="product-card" key={product.id}>
            <div className={`product-image image-tone-${index % 4}`}><span className="product-number">N° {String(product.id).padStart(2, '0')}</span><button className="favorite-button" aria-label={`Guardar ${product.title}`} type="button">♡</button><img src={product.image} alt={product.title} loading="lazy" /><button className="quick-add" type="button" onClick={() => setCartCount((count) => count + 1)}>Agregar al carrito <span>+</span></button></div>
            <div className="product-info"><div><p className="product-category">{product.category}</p><h3>{product.title}</h3></div><span className="product-price">{money.format(product.price)}</span></div>
            <div className="rating"><span>★</span> {product.rating?.rate ?? '—'} <span className="rating-count">({product.rating?.count ?? 0})</span></div>
          </article>)}</div>}
          <div className="catalog-footer"><span>MOSTRANDO {visibleProducts.length} DE {products.length} PIEZAS</span><a href="#inicio">Volver arriba ↑</a></div>
        </section>
      </main>
      <footer id="nosotros"><a className="brand" href="#inicio"><span className="brand-mark">N</span><span>NOVA<span className="brand-dot">.</span></span></a><span>Objetos cotidianos, elegidos con intención.</span><span>© 2026 NOVA STUDIO</span></footer>
    </div>
  )
}

export default App

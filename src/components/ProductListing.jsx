import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Container, Row, Col, Alert, Form, Spinner, Button, Card, Placeholder } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { useToast } from './ToastContext';

function SkeletonCard() {
  return (
    <Card className="h-100 shadow-sm">
      <Placeholder as={Card.Img} animation="wave" style={{ height: 200 }} />
      <Card.Body>
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="wave">
          <Placeholder xs={4} />
        </Placeholder>
        <Placeholder.Button variant="primary" xs={6} />
      </Card.Body>
    </Card>
  );
}

const PAGE_SIZE = 12;

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();
  const cancelSource = useRef();

  // Debounced search
  useEffect(() => {
    setSearching(true);
    const handler = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line
  }, [search]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    if (cancelSource.current) cancelSource.current.cancel();
    cancelSource.current = axios.CancelToken.source();
    axios
      .get('https://fakestoreapi.com/products', { cancelToken: cancelSource.current.token })
      .then((res) => {
        let filtered = res.data;
        if (search) {
          filtered = filtered.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase())
          );
        }
        setProducts(filtered);
        setDisplayed(filtered.slice(0, PAGE_SIZE));
        setHasMore(filtered.length > PAGE_SIZE);
        setLoading(false);
        setSearching(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          const msg = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
          setError(msg);
          setLoading(false);
          setSearching(false);
          toast.showToast(msg, { variant: 'danger' });
        }
      });
  }, [search]);

  useEffect(() => {
    fetchProducts();
    return () => {
      if (cancelSource.current) cancelSource.current.cancel();
    };
    // eslint-disable-next-line
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        displayed.length < products.length
      ) {
        setDisplayed((prev) =>
          products.slice(0, Math.min(prev.length + PAGE_SIZE, products.length))
        );
        setHasMore(products.length > displayed.length + PAGE_SIZE);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [displayed, products, hasMore, loading]);

  // Inline editing
  const handleEdit = (id) => {
    setEditingId(id);
    const prod = products.find((p) => p.id === id);
    setEditForm({ title: prod.title, price: prod.price });
  };
  const handleEditChange = (e) => {
    setEditForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleEditSave = (id) => {
    // Optimistic update
    const prev = products.find((p) => p.id === id);
    setProducts((ps) =>
      ps.map((p) =>
        p.id === id ? { ...p, ...editForm, price: parseFloat(editForm.price) } : p
      )
    );
    setEditingId(null);
    toast.showToast('Product updated (optimistic)', { variant: 'success' });
    axios
      .put(`https://fakestoreapi.com/products/${id}`, {
        ...prev,
        ...editForm,
        price: parseFloat(editForm.price),
      })
      .catch(() => {
        setProducts((ps) => ps.map((p) => (p.id === id ? prev : p)));
        toast.showToast('Update failed, reverted', { variant: 'danger' });
      });
  };

  // Accessibility: focus management for search
  const searchRef = useRef();
  useEffect(() => {
    if (searchRef.current) searchRef.current.setAttribute('aria-label', 'Search products');
  }, []);

  if (error)
    return (
      <Container className="my-5" role="main">
        <Alert variant="danger" className="text-center" role="alert">
          {error}
        </Alert>
      </Container>
    );

  return (
    <Container className="my-5" role="main">
      <h2 className="mb-4 text-center" tabIndex={0}>Product Listing</h2>
      <Form className="mb-4" role="search" aria-label="Product search">
        <Form.Control
          ref={searchRef}
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
        />
      </Form>
      <Row>
        {(loading || searching)
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Col key={i} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <SkeletonCard />
              </Col>
            ))
          : displayed.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                {/* Responsive card */}
                {editingId === product.id ? (
                  <Card className="h-100 shadow-sm" aria-label="Edit product">
                    <Card.Body>
                      <Form>
                        <Form.Group>
                          <Form.Label visuallyHidden>Title</Form.Label>
                          <Form.Control
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            aria-label="Edit title"
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label visuallyHidden>Price</Form.Label>
                          <Form.Control
                            name="price"
                            type="number"
                            value={editForm.price}
                            onChange={handleEditChange}
                            aria-label="Edit price"
                          />
                        </Form.Group>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2 mt-2"
                          onClick={() => handleEditSave(product.id)}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                ) : (
                  <ProductCard
                    product={product}
                    onEdit={() => handleEdit(product.id)}
                    editable
                  />
                )}
              </Col>
            ))}
      </Row>
      {hasMore && !loading && (
        <div className="text-center my-4" aria-live="polite">
          <Spinner animation="border" size="sm" /> Loading more...
        </div>
      )}
    </Container>
  );
};

export default ProductListing;

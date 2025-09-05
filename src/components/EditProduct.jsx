import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useToast } from './ToastContext';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', price: '', description: '', category: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();
  const cancelRef = useRef();

  useEffect(() => {
    if (cancelRef.current) cancelRef.current.abort();
    cancelRef.current = new AbortController();
    fetch(`https://fakestoreapi.com/products/${id}`, { signal: cancelRef.current.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || '',
          price: data.price || '',
          description: data.description || '',
          category: data.category || ''
        });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          const msg = err.message || 'An unexpected error occurred. Please try again.';
          setError(msg);
        }
      });
    return () => cancelRef.current?.abort();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    fetch(`https://fakestoreapi.com/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update product');
        return res.json();
      })
      .then(() => {
        toast.showToast('Product updated successfully! (Note: This is a test API, so the update will not persist.)', { variant: 'success' });
        setSaving(false);
      })
      .catch((err) => {
        const msg = err.message || 'An unexpected error occurred. Please try again.';
        setError(msg);
        toast.showToast(msg, { variant: 'danger' });
        setSaving(false);
      });
  };

  if (error) return (
    <Container className="my-5" role="main">
      <div className="text-center" role="alert">{error}</div>
    </Container>
  );

  return (
    <Container className="my-5" role="main">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xs={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">Edit Product</Card.Title>
              <Form onSubmit={handleSubmit} aria-label="Edit product form">
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Product Title</Form.Label>
                  <Form.Control type="text" name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Control type="text" name="category" value={form.category} onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Product'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;


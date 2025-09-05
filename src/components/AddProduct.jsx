import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useToast } from './ToastContext';

const AddProduct = () => {
  const [form, setForm] = useState({ title: '', price: '', description: '', category: '' });
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.get('https://fakestoreapi.com/products');
      toast.showToast('Fetched products successfully! (Note: This is a test API, so the product will not persist.)', { variant: 'success' });
      setForm({ title: '', price: '', description: '', category: '' });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
      toast.showToast(msg, { variant: 'danger' });
    }
  };

  return (
    <Container className="my-5" role="main">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xs={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">Add New Product</Card.Title>
              <Form onSubmit={handleSubmit} autoComplete="off" aria-label="Add product form">
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
                <Button variant="primary" type="submit">
                  Add Product
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};



export default AddProduct;

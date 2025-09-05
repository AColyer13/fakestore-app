import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Modal, Placeholder } from 'react-bootstrap';
import { useToast } from './ToastContext';

function SkeletonDetails() {
  return (
    <Container className="my-5">
      <Row>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <Placeholder as="div" animation="wave" style={{ width: '100%', height: 350 }} />
        </Col>
        <Col md={6}>
          <Card className="shadow p-4">
            <Card.Body>
              <Placeholder as={Card.Title} animation="wave">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder.Button variant="success" xs={4} />
              <Placeholder.Button variant="danger" xs={4} className="ms-2" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [optimisticallyDeleted, setOptimisticallyDeleted] = useState(false);
  const toast = useToast();
  const cancelSource = useRef();

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (cancelSource.current) cancelSource.current.cancel();
    cancelSource.current = axios.CancelToken.source();
    axios
      .get(`https://fakestoreapi.com/products/${id}`, { cancelToken: cancelSource.current.token })
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          const msg = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
          setError(msg);
          setLoading(false);
          toast.showToast(msg, { variant: 'danger' });
        }
      });
    return () => {
      if (cancelSource.current) cancelSource.current.cancel();
    };
  }, [id]);

  const handleDelete = () => {
    setOptimisticallyDeleted(true);
    setShowModal(false);
    toast.showToast('Product deleted', {
      variant: 'warning',
      action: handleUndo,
      actionLabel: 'Undo',
      delay: 5000,
    });
    axios
      .delete(`https://fakestoreapi.com/products/${id}`)
      .then(() => {
        setTimeout(() => {
          if (!optimisticallyDeleted) return;
          navigate('/products');
        }, 5000);
      })
      .catch((err) => {
        setOptimisticallyDeleted(false);
        const msg = err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.';
        setDeleteError(msg);
        toast.showToast(msg, { variant: 'danger' });
      });
  };

  const handleUndo = () => {
    setOptimisticallyDeleted(false);
    toast.showToast('Delete undone', { variant: 'info' });
  };

  if (error)
    return (
      <Container className="my-5" role="main">
        <Alert variant="danger" className="text-center" role="alert">
          {error}
        </Alert>
      </Container>
    );
  if (loading) return <SkeletonDetails />;
  if (!product || optimisticallyDeleted) return null;

  return (
    <Container className="my-5" role="main">
      <Row>
        <Col md={6} xs={12} className="d-flex align-items-center justify-content-center">
          <img
            src={product.image}
            alt={product.title}
            style={{ maxHeight: 350, objectFit: 'contain', width: '100%' }}
            aria-label={product.title}
          />
        </Col>
        <Col md={6} xs={12}>
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title as="h2" tabIndex={0}>{product.title}</Card.Title>
              <Card.Text><strong>Category:</strong> {product.category}</Card.Text>
              <Card.Text><strong>Description:</strong> {product.description}</Card.Text>
              <Card.Text><strong>Price:</strong> ${product.price}</Card.Text>
              <Button variant="success" className="me-2 mb-2" aria-label="Add to cart">Add to Cart</Button>
              <Button
                variant="danger"
                className="mb-2"
                onClick={() => setShowModal(true)}
                aria-label="Delete product"
              >
                Delete Product
              </Button>
              {deleteError && <Alert variant="danger" className="mt-2">{deleteError}</Alert>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetails;

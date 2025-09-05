import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onEdit, editable }) => {
  const navigate = useNavigate();
  return (
    <Card className="h-100 shadow-sm" tabIndex={0} role="region" aria-label={product.title}>
      <Card.Img
        variant="top"
        src={product.image}
        className="img-fluid"
        style={{ height: '200px', objectFit: 'contain' }}
        alt={product.title}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Text className="mb-2">${product.price}</Card.Text>
        <Button
          variant="primary"
          onClick={() => navigate(`/products/${product.id}`)}
          className="mt-auto"
          aria-label={`View details for ${product.title}`}
        >
          View Details
        </Button>
        {editable && (
          <Button
            variant="outline-secondary"
            size="sm"
            className="mt-2"
            onClick={onEdit}
            aria-label={`Edit ${product.title}`}
          >
            Edit
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

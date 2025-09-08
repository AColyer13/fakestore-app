import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Container className="py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Row>
        <Col>
          <Card className="text-center p-4 shadow">
            <Card.Body>
              <Card.Title as="h1">
                Welcome to the Sample Ecommerce Store!
              </Card.Title>
              <Card.Text>
                Discover a variety of products and enjoy a seamless shopping
                experience. Browse our product listings and find what you need!
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/fakestore-app/products")}
              >
                View Products
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

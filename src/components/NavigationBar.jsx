import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => (
  <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect sticky="top">
    <Container>
      <LinkContainer to="/fakestore-app">
        <Navbar.Brand>Sample Ecommerce Store</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="main-navbar-nav" />
      <Navbar.Collapse id="main-navbar-nav">
        <Nav className="ms-auto">
          <LinkContainer to="/fakestore-app">
            <Nav.Link>Home</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/fakestore-app/products">
            <Nav.Link>Product Listing</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/fakestore-app/add-product">
            <Nav.Link>Add Product</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default NavigationBar;

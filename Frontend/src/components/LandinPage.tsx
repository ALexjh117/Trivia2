import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Navbar,
  Nav,
  Carousel,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import triviaImg from "../../public/img/trivia.jpg";
import atrapameImg from "../../public/img/picachu-q.jpg";
import ecoRutaImg from "../../public/img/ecort.webp";
const LandingPage: React.FC = () => {
  const Navigate = useNavigate();
  const juegos = [
    {
      titulo: "Trivia",
      descripcion: "Pon a prueba tus conocimientos.",
      img: triviaImg,
      url: "/juego/trivia",
    },
    {
      titulo: "Atrapame si puedes",
      descripcion: "Agilidad mental.",
      img: atrapameImg,
      url: "/juego/atrapame",
    },
    {
      titulo: "EcoRuta",
      descripcion: "Sal a dar un paseo!.",
      img: ecoRutaImg,
      url: "/juego/ecoruta",
    },
  ];

  return (
    <>
      {/* Navbar con loguito */}
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">
            <img
              src="../img/sena.png"
              alt="Logo"
              width="40"
              height="40"
              className="d-inline-block align-top me-2"
            />
            SenaSoft
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
            
              <Nav.Link href="#juegos">Juegos</Nav.Link>
              <Nav.Link href="#nosotros">Nosotros</Nav.Link>
              <Nav.Link href="#contacto">Contacto</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero con carrusel */}
      <section className="hero-section">
        <Carousel>
          <Carousel.Item>
            <div
              style={{
                height: "80vh",
                background: "linear-gradient(135deg, #C3D600, #008F7A)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                flexDirection: "column",
              }}
            >
              <h1 className="display-3 fw-bold">
                Bienvenidos a un Mundo digital
              </h1>
              <p className="lead">
                Innovación, tecnología y diversión en cada proyecto.
              </p>
              <Button
                variant="light"
                size="lg"
                onClick={() => Navigate("/juego")}
              >
                Comenzar
              </Button>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div
              style={{
                height: "80vh",
                background: "linear-gradient(135deg,  #008F7A, #00B4D8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                flexDirection: "column",
              }}
            >
              <h1 className="display-3 fw-bold">Descubre nuestros juegos</h1>
              <p className="lead">Experiencias interactivas para todos.</p>
              <Button variant="light" size="lg">
                Ver Juegos
              </Button>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Sección de Juegos */}
      <section id="juegos" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Nuestros Juegos</h2>
          <Row className="g-4">
            {juegos.map((juego, idx) => (
              <Col md={4} key={idx}>
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={juego.img} />

                  <Card.Body>
                    <Card.Title>{juego.titulo}</Card.Title>
                    <Card.Text>{juego.descripcion}</Card.Text>
                    <Button href={juego.url} variant="primary">
                      Jugar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <img
                src="../img/equipo.jpeg"
                alt="Equipo"
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h2>Sobre Nosotros</h2>
              <p>
                Somos un equipo apasionado por la tecnología y la innovación,
                creando experiencias únicas e interactivas.
              </p>
              <Button variant="primary">Conócenos</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Contacto</h2>
          <Row className="justify-content-center">
            <Col md={6}>
              <form>
                <input
                  className="form-control mb-3"
                  type="text"
                  placeholder="Nombre"
                />
                <input
                  className="form-control mb-3"
                  type="email"
                  placeholder="Correo"
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Mensaje"
                  rows={4}
                ></textarea>
                <Button type="submit" variant="success" className="w-100">
                  Enviar
                </Button>
              </form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 bg-dark text-white">
        &copy; 2025 MiEmpresa. Todos los derechos reservados.
      </footer>
    </>
  );
};

export default LandingPage;

import { FormEvent, useRef } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

export function SignUp() {
    const nameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const passwordConfirmRef = useRef(null)

    function handleCreateAccount(e: FormEvent) {
        e.preventDefault();

        

    }

    return <Container>
         <Row className="align-items-center mb-4">
            <Col><h1 className="text-center">Sign Up</h1></Col>
            {/* <Col xs="auto">
                <Stack gap={2} direction="horizontal">
                    <Link to="/new">
                        <Button variant="primary">Create</Button>
                    </Link>
                    <Button variant="outline-secondary">Edit Tags</Button>
                </Stack>
            </Col> */}
        </Row>
        <Form onSubmit={handleCreateAccount}>
            <Form.Group controlId="name">
                <Form.Label>Your name:</Form.Label>
                <Form.Control type="text" required ref={nameRef} />
            </Form.Group>
            <Form.Group controlId="email">
                <Form.Label>Your email address:</Form.Label>
                <Form.Control type="email" required ref={emailRef} />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Your password:</Form.Label>
                <Form.Control type="password" required ref={passwordRef} />
            </Form.Group>
            <Form.Group controlId="passwordConfirm">
                <Form.Label>Confirm your password:</Form.Label>
                <Form.Control type="password" required ref={passwordConfirmRef} />
            </Form.Group>
            <Button type="submit">Create Account</Button>
        </Form> 
    </Container>
}
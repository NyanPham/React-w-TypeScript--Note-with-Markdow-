import { FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logInWIthEmailAndPassword, signInWithGoogle, auth } from '../../firebase'
import { useAuthState } from "react-firebase-hooks/auth";

export function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user) alert("Created account");
    }, [user, loading]);
    
    async function handleLogIn(e: FormEvent) {
        e.preventDefault();

        try {
            await logInWIthEmailAndPassword(email, password)
            alert("Logged in")
        } catch (err) {
            if (err instanceof Error) {
                console.error(err)
                alert(err.message)
            }
        }
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
        <Form onSubmit={handleLogIn}>
            <Form.Group controlId="email">
                <Form.Label>Your email address:</Form.Label>
                <Form.Control 
                    type="email" 
                    required 
                    value={email}  
                    onChange={e => setEmail(e.target.value)}
                />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Your password:</Form.Label>
                <Form.Control 
                    type="password" 
                    required  
                    value={password}  
                    onChange={e => setPassword(e.target.value)}
                />
            </Form.Group>
            <Button type="submit">Log In</Button>
            <Button onClick={signInWithGoogle} type="button">Login with Google</Button>
        </Form> 
    </Container>
}
import { FormEvent, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { registerWithEmailAndPassword, auth } from '../../firebase'
import { useAuthState } from "react-firebase-hooks/auth";


export function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (loading) return;
        if (user) alert("Created account");
    }, [user, loading]);
    
    async function handleCreateAccount(e: FormEvent) {
        e.preventDefault();

        if (name == "" || email == "" || password == "") return alert("Please enter the fields")
        if (passwordConfirm !== password) return alert("Passwords do not match")

        try {
            await registerWithEmailAndPassword(name, email, password)
            alert("account created")
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
        <Form onSubmit={handleCreateAccount}>
            <Form.Group controlId="name">
                <Form.Label>Your name:</Form.Label>
                <Form.Control 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>
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
            <Form.Group controlId="passwordConfirm">
                <Form.Label>Confirm your password:</Form.Label>
                <Form.Control 
                    type="password" 
                    required  
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
                />
            </Form.Group>
            <Button type="submit">Create Account</Button>
        </Form> 
    </Container>
}
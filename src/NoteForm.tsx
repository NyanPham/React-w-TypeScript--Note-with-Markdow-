import { FormEvent, useRef, useState } from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreataboleReactSelect from 'react-select/creatable'
import { NoteData, Tag } from "./App"
import { v4 as uuidV4 } from 'uuid'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData>

export function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] } : NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const markdownRef = useRef<HTMLTextAreaElement>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
    const [user, loading, error] = useAuthState(auth)

    const navigate = useNavigate();

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        if (user == null) return;

        onSubmit({
            title: titleRef.current!.value,
            markdown: markdownRef.current!.value,
            tags: selectedTags,
            userId: user.uid
        })
        
        navigate('..')
    }

    return <>
        {user != null && <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control ref={titleRef} required defaultValue={title} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <CreataboleReactSelect 
                        onCreateOption={label => {
                                const newTag = { id: uuidV4(), label, userId: user.uid };
                                onAddTag(newTag)
                                setSelectedTags(prev => [...prev,  newTag])
                            }}
                            value={selectedTags.map((tag) =>  (
                                { label: tag.label, value: tag.id }
                            ))} 
                            options={availableTags.map(tag => (
                                {
                                    label: tag.label, value: tag.id
                                }
                            ))}
                            onChange={tags => {
                                setSelectedTags(tags.map(tag => (
                                    {
                                        label: tag.label,
                                        id: tag.value,
                                        userId: user.uid
                                    }
                                )))
                            }}
                            isMulti
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="markdown">
                <Form.Label>Body</Form.Label>
                <Form.Control ref={markdownRef} required as='textarea' rows={15} defaultValue={markdown} />
            </Form.Group>
            <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button type='submit' variant="primary">Save</Button>
                <Link to="..">
                    <Button type='button' variant="outline-secondary">Cancel</Button>
                </Link>
            </Stack>
        </Stack>
    </Form>}
    </>
}
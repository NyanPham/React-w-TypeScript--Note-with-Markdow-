import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useMemo } from "react"
import { Container } from "react-bootstrap"
import { Navigate, Route, Routes } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4 } from 'uuid'
import { NoteList } from "./NoteList"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"
import { SignUp } from "./Authenticate/SignUp"
import { LogIn } from "./Authenticate/LogIn"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, getNotes, getTags, addNoteDB, addTagDB } from "../firebase"

export type Note = {
  id: string,
} & NoteData

export type RawNote = {
  id: string,
} & RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[],
  userId: string,
}

export type NoteData = {
  title: string,
  markdown: string,
  tags: Tag[],
  userId: string
}

export type Tag = {
  id: string,
  label: string,
  userId: string,
}

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
      if (loading) return;
      if (user) {
        const fetchNotes = async () => {
          const fetchedNotes = await getNotes(user.uid)
          const fetchedTags = await getTags(user.uid)

          setNotes(fetchedNotes as RawNote[]);
          setTags(fetchedTags as Tag[])
        }

        fetchNotes();
      }
  }, [user, loading])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data}:  NoteData) {
    if (user == null) return;

    const newNote: RawNote = {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id), userId: user.uid } 

    addNoteDB(newNote)
      
    setNotes(prevNotes => {
      return [...prevNotes, newNote]
    })
  }

  function addTag(tag: Tag) {
    if (user == null) return;

    addTagDB(tag)

    setTags(prev => [...prev, {...tag, userId: user.uid }])
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if (note.id === id) {
          return {...note, ...data, tagIds: tags.map(tag => tag.id)}
        } else {
          return note
        }
      })
    })
  }

  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  } 

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return {...tag, label}
        } else {
          return tag
        }
      })
    })
  } 

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return <Container className="my-4">
  <Routes>
  <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag}/>}/>
  <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}/>
  <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
    <Route index element={<Note onDelete={onDeleteNote} />} />
    <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
  </Route>
  <Route path="/signup" element={<SignUp />} />
  <Route path="/login" element={<LogIn />} />
  <Route path="*" element={<Navigate to="/" />}/>
</Routes>
</Container>
}

export default App

import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import NoteTab from './NoteTab';


function NotebookTab({setSelectedNotebookId,
               selectedNotebookId,
               notebookName, notebookId}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [btnState, setBtnState] = useState('unselected');
  const notes = useSelector(state => state.session.notes);
  let noteTree;

  if(isExpanded) {
   noteTree = (
    <div className='collapsible-notes'>
      {
        notes.map(note => {
          if(note.notebookId === notebookId) {
            return <NoteTab
              noteId={note.id}
              key={`note-${note.id}`}
              noteName={note.title} />
          }
        })
      }
    </div>
   );
  }

  function expand() {
    setSelectedNotebookId(notebookId);
    if(isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  useEffect(() => {
    if(selectedNotebookId === notebookId)
      setBtnState('note-btn-selected')
    else
      setBtnState('unselected');
  }, [selectedNotebookId])

  return (
    <div className='notebook-node'>
      <button onClick={expand} className='notebook-btn' id={`${btnState}`}>
        {notebookName}
      </button>
      {isExpanded && noteTree}
    </div>
  );
}

export default NotebookTab;

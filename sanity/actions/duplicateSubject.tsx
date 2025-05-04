import { useState } from 'react'
import { Stack, Text, TextInput, Button, Dialog } from '@sanity/ui'
import { client } from '../lib/client'

export const duplicateSubject = {
  name: 'duplicateSubject',
  title: 'Duplicate Subject',
  type: 'action',
  component: ({ id, onComplete }: { id: string; onComplete: () => void }) => {
    const [newSubject, setNewSubject] = useState('')

    const handleDuplicate = async () => {
      // Fetch the original document
      const doc = await client.getDocument(id)
      
      if (!doc) return

      // Create new document with modified fields
      const newDoc = {
        _type: doc._type,
        subject: newSubject,
        title: `Online IB ${newSubject} Tutors`,
        subtitle: doc.subtitle,
        reviews: doc.reviews,
        backgroundImage: doc.backgroundImage,
        callToAction: doc.callToAction,
      }

      try {
        await client.create(newDoc)
        onComplete()
      } catch (error) {
        console.error('Error duplicating document:', error)
      }
    }

    return (
      <Dialog
        header="Duplicate Subject Page"
        id="duplicate-dialog"
        width={2}
        position="fixed"
      >
        <Stack space={4} padding={4}>
          <Text>Enter the name of the new subject (e.g. Physics, Chemistry):</Text>
          <TextInput
            value={newSubject}
            onChange={event => setNewSubject(event.currentTarget.value)}
            placeholder="Enter subject name"
          />
          <Button
            tone="primary"
            onClick={handleDuplicate}
            disabled={!newSubject}
            text="Create New Subject Page"
          />
        </Stack>
      </Dialog>
    )
  }
} 
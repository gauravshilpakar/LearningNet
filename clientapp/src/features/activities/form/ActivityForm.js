import React, { useState, useContext } from 'react';
import { Form, Segment, Button } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore'

export const ActivityForm = () => {
    const activityStore = useContext(ActivityStore)
    const { createActivity, editActivity, cancelFormOpen, submitting, selectedActivity } = activityStore
    const initForm = () => {
        if (selectedActivity) return selectedActivity
        else {
            return {
                id: '',
                title: '',
                category: '',
                city: '',
                description: '',
                venue: '',
                date: '',
            }
        }
    }
    const [activity, setActivity] = useState(initForm)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setActivity({ ...activity, [name]: value })
    }

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity)
        } else {
            editActivity(activity)
        }
    }

    return (

        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder="Title" value={activity.title} />
                <Form.TextArea onChange={handleInputChange} name='description' rows={3} placeholder="Description" value={activity.description} />
                <Form.Input onChange={handleInputChange} name='category' placeholder="Category" value={activity.category} />
                <Form.Input onChange={handleInputChange} name='date' type='datetime-local' placeholder="Date" value={activity.date} />
                <Form.Input onChange={handleInputChange} name='city' placeholder="City" value={activity.city} />
                <Form.Input onChange={handleInputChange} name='venue' placeholder="Venue" value={activity.venue} />

                <Button loading={submitting} floated='right' positive type='submit ' content='Submit' />
                <Button floated='right' content='Cancel' negative onClick={() => cancelFormOpen()} />
            </Form>
        </Segment >

    )
}

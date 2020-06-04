import React, { useContext } from 'react'
import { Item, Button, Segment, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore'

const ActivityList = () => {

    const activityStore = useContext(ActivityStore)
    const { activitiesByDate, handleSelectActivity, handleDeleteActivity, submitting, target } = activityStore
    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map(act => (
                    <Item key={act.id}>
                        <Item.Content>
                            <Item.Header as='a'>{act.title}</Item.Header>
                            <Item.Meta>{act.date}</Item.Meta>
                            <Item.Description>
                                <div>{act.description}</div>
                                <div>{act.city}, {act.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    floated='right'
                                    content='View'
                                    color='blue'
                                    onClick={() => handleSelectActivity(act.id)} />
                                <Button
                                    name={act.id}
                                    loading={target === act.id && submitting}
                                    floated='right'
                                    content='Delete'
                                    color='red'
                                    onClick={(e) => handleDeleteActivity(e, act.id)} />
                                <Label basic content={act.category} />
                            </Item.Extra>
                        </Item.Content >
                    </Item>
                ))}
            </Item.Group >
        </Segment >
    );
}

export default observer(ActivityList)


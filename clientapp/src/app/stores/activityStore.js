import { observable, decorate, action, computed } from 'mobx'
import { createContext } from 'react'
import agent from '../api/agent'

class ActivityStore {
    activities = []
    selectedActivity = null
    loadingInitial = false
    editMode = false
    submitting = false
    activityRegistry = new Map()
    target = ''

    loadActivities = async () => {
        this.loadingInitial = true
        try {
            const activities = await agent.Activities.list()
            activities.forEach((activity) => {
                activity.date = activity.date.split('.')[0]
                this.activityRegistry.set(activity.id, activity);
            })
            this.loadingInitial = false
        } catch (error) {
            console.log(error)
            this.loadingInitial = false
        }
    };

    createActivity = async (activity) => {
        this.submitting = true
        try {
            await agent.Activities.create(activity)
            this.activityRegistry.set(activity.id, activity)
            this.editMode = false
            this.submitting = false
        } catch (error) {
            console.log(error)

        }
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        )
    }

    openCreateForm = () => {
        this.editMode = true
        this.selectedActivity = undefined
    }

    handleSelectActivity = (id) => {
        this.selectedActivity = this.activityRegistry.get(id)
        this.editMode = false
    }

    editActivity = async (activity) => {
        this.submitting = true
        try {
            await agent.Activities.update(activity)
            this.activityRegistry.set(activity.id, activity)
            this.selectedActivity = activity
            this.editMode = false
            this.submitting = false
        } catch (error) {
            this.submitting = false
            console.log(error)
        }
    }

    openEditForm = (id) => {
        this.selectedActivity = this.activityRegistry.get(id)
        this.editMode = true
    }
    cancelSelectedActivity = () => {
        this.selectedActivity = undefined
    }

    cancelFormOpen = () => {
        this.editMode = false
    }
    handleDeleteActivity = async (event, id) => {
        this.submitting = true
        this.target = event.currentTarget.name
        try {
            await agent.Activities.delete(id)
            this.activityRegistry.delete(id)
            this.submitting = false
            this.target = ''
        } catch (error) {
            console.log(error)
            this.submitting = false
            this.target = ''
        }


    }

}

decorate(ActivityStore, {
    activities: observable,
    loadingInitial: observable,
    selectedActivity: observable,
    editMode: observable,
    submitting: observable,
    activityRegistry: observable,
    loadActivities: action,
    handleSelectActivity: action,
    createActivity: action,
    openCreateForm: action,
    activitiesByDate: computed,
    editActivity: action,
    openEditForm: action,
    cancelSelectedActivity: action,
    cancelFormOpen: action,
    handleDeleteActivity: action,
    target: observable
});

export default createContext(new ActivityStore()) 
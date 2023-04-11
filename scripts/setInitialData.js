const initialTasks = [
    {
        id: 1,
        description: 'Work',
        createdAt: new Date('2023-04-03T10:20').toISOString(),
        selectedDate: new Date('2023-04-18T16:19'),
        deadline_ms: new Date('2023-04-18T16:19') - new Date(),
        deadline: new Date('2023-04-18T16:19'),
        completedAt: null
    },
    {
        id: 2,
        description: 'Workout',
        createdAt: new Date('2023-04-02T11:30').toISOString(),
        selectedDate: new Date('2023-04-22T16:25'),
        deadline_ms: new Date('2023-04-18T16:19') - new Date(),
        deadline: new Date('2023-04-18T16:19'),
        completedAt: null
    },
    {
        id: 3,
        description: 'Sleep',
        createdAt: new Date('2023-04-01T15:45').toISOString(),
        selectedDate: new Date('2023-04-25T14:19'),
        deadline_ms: new Date('2023-04-18T16:19') - new Date(),
        deadline: new Date('2023-04-18T16:19'),
        completedAt: null
    }, 
];


window.addEventListener('load', () => {
    addInitialDataToSessionStorage();
})

function addInitialDataToSessionStorage() {
    window.sessionStorage.setItem('tasks', JSON.stringify(initialTasks));
}
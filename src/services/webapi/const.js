const TASK_INSTRUCTION = {
    implment: 0,
    pause: 1,
    delete: 2
}
const port=1978
const TASK_STATUS = {
    wrong: -1,
    implmenting: 0,
    paused: 1,
    completed: 2
}
const API_URL = {
    auth:'/auth',
    task:{
        add: '/task/add',
        del:'/task/delete',
        start:'/task/start',
        pause:'/task/pause',
        get:'/task/get',
    },
    
    node:{
        add:'/node/add',
        del:'/node/delete',
        update:'/node/update',
        get:'/node/get',
        getTaskInfo:'/node/getTaskinfo',

    },

    target:{
        add:'/target/add',
        del:'/target/delete',
        update:'/target/update',
        get:'/target/get',
    },


    plugin:{
        add:'/plugin/add',
        del:'/plugin/delete',
        get:'/plugin/get',

    },
    


}
const TABLE_NAME = {
    task: 'task',
    node:'node',
    target:'target',
    plugin:'plugin',
    nodeTask:'nodeTask'
}
module.exports = {
    TASK_INSTRUCTION,
    TASK_STATUS,
    API_URL,
    TABLE_NAME,
    port
}
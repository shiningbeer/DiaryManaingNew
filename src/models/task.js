import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { task } from '../services/api';

export default {
  namespace: 'task',

  state: {
    newTask: {
      name: '',
      description: '',
      targetList:[],
      pluginList: [],
    },
    taskList:[]
  },
 
  effects: {
    *add({ payload }, { put,call }) {
      const result= yield call(task.add, {newTask:payload});
      if(result=='ok'){
        yield put({
          type: 'saveStepData',
          payload,
        });
        yield put(routerRedux.push('/task/newtask/step4'));
      }
    },
    *get({ payload }, { put,call }){
      const result= yield call(task.get, payload);
      yield put({
        type: 'getTaskList',
        taskList:result
      });
    },
    *del({payload}, { call, put }) {
      const re =yield call(task.del,{taskId:payload});
      re=='ok'?message.success('删除任务成功'):message.warning('删除任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 
    *start({payload}, { call, put }) {
      const re =yield call(task.start,payload);
      re=='ok'?message.success('任务已开始'):message.warning('开始任务失败')
      yield put({
        type: 'get',
        payload:{},
      });
    }, 

    
  },

  reducers: {
    saveStepData(state, { payload }) {
      return {
        ...state,
        newTask: {
          ...state.newTask,
          ...payload,
        },
      };
    },
    getTaskList(state,{taskList}){
      return {
        ...state,
        taskList,
      };
    }
  },
};

import React, { PureComponent } from 'react';
import moment from 'moment';
import index, { connect } from 'dva';
import { Modal,message,Upload,List, Card, Row, Col, Radio, Input, Progress, Button, Icon, Dropdown, Menu, Avatar } from 'antd';
import {FaEdit,FaTrashO} from 'react-icons/lib/fa'
import crypto from 'crypto'
import Identicon from 'identicon.js'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { routerRedux } from 'dva/router';
import styles from './style.less';
const Dragger = Upload.Dragger;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

@connect(({ plugin, loading }) => ({
  pluginList:plugin.pluginList,
  loading: loading.effects['plugin/get']
}))
export default class PluginList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'plugin/get',
      payload: {
        count: 6,
      },
    });
  }
  state={
    mouseOverEditBtnIndex:-1,
    mouseOverDelBtnIndex:-1
  }
  render() {
    const { pluginList, loading,dispatch } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const editBtnOutLook=(index)=>index==this.state.mouseOverEditBtnIndex?
          {
            size:28,
            color:'red'
          }:
          {
            size:28,
            color:'dodgerblue'
          }
    const delBtnOutLook=(index)=>index==this.state.mouseOverDelBtnIndex?
          {
            size:30,
            color:'red'
          }:
          {
            size:30,
            color:'dodgerblue'
          }
    

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">我的</RadioButton>
        </RadioGroup>
       
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入"
          onSearch={() => ({})}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 6,
      total: 50,
    };

    const ListContent = ({ data: { user, usedCount,uploadAt, }}) => {

      return(
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>用户</span>
          <p>{user}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>使用次数</span>
          <p>{usedCount}</p>
        </div>
        
        <div className={styles.listContentItem}>
          <span>上传时间</span>
          <p>{moment(uploadAt).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    )};
    const props = {
      name: 'file',
      multiple: true,
      action: 'http://localhost:1978/plugin/add',
      headers:{'token':localStorage.getItem('token')},
      onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          dispatch({
            type: 'plugin/get',
            payload: {
              count: 6,
            },
          });
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const confirm = Modal.confirm;
    function showConfirm(name) {
      confirm({
        title: '确认删除',
        content: `确认要删除插件"${name}"吗？`,
        onOk() {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          // }).catch(() => console.log('Oops errors!'));
          dispatch({
            type: 'plugin/del',
            payload: name,
          });
        },
        onCancel() {},
      });
    }

    return (
      <PageHeaderLayout title="插件管理" content="本工具只支持python所写的插件。">
        <div className={styles.standardList} style={{marginLeft:30,marginRight:30}}>
          
        <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">添加新插件</p>
              <p className="ant-upload-hint">点击选择插件或者直接将插件文件拖拽入框内，支持多选。请注意不要与已有插件同名！</p>
              <p className="ant-upload-hint">插件的描述可在添加完毕后点击编辑图标修改。</p>
            </Dragger>
          <Card
            className={styles.listCard}
            bordered={false}
            title="插件列表"
            style={{ marginTop: 24,marginLeft:30,marginRight:30 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            
            <List
              size="large"
              rowKey="id"
              loading={loading}
              
              pagination={paginationProps}
              dataSource={pluginList}
              renderItem={(item,index) => {
                let hash = crypto.createHash('md5')
                hash.update(item.name); // 传入用户名
                let imgData = new Identicon(hash.digest('hex')).toString()
                let imgUrl = 'data:image/png;base64,'+imgData
                if(item.des=='')
                    item.des='用户尚未更新描述。'
                return (
                <List.Item
                // onMouseLeave={()=>this.setState({mouseOver:false})}
                  actions={[<a>详细</a>,
                    <div style={{width:100}}>
                    
                    <FaEdit
                      style={{fontSize: editBtnOutLook(index).size,color: editBtnOutLook(index).color,marginTop:6}}
                      onMouseEnter={()=> this.setState( {mouseOverEditBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverEditBtnIndex:-1})}
                    />
                    <FaTrashO 
                      style={{fontSize:delBtnOutLook(index).size,color:delBtnOutLook(index).color}}
                      onClick={()=>showConfirm(item.name)}
                      onMouseEnter={()=> this.setState( {mouseOverDelBtnIndex:index})}                      
                      onMouseLeave={()=> this.setState( {mouseOverDelBtnIndex:-1})}
                    />
                </div>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={imgUrl} shape="square" size="small" />}
                    title={item.name}
                    description={item.des}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}

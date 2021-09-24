import React, {Component} from 'react';
import {Checkbox,Icon,Button} from 'antd'
import {render} from 'react-dom';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import style from './style.less'
const arrayMoveMutate = (array, from, to) => {
	array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};

const arrayMove = (array, from, to) => {
	array = array.slice();
	arrayMoveMutate(array, from, to);
	return array;
};
class SortableComponent extends Component {
  state = {
    items:[],
    keys:[],
  };
 componentDidMount(){
  let items=this.iterator(this.props.columns)
  this.setState({items})
 }
  iterator=obj=>{
     // 根据obj的类型判断是新建一个数组还是对象
     let newObj = Array.isArray(obj)? [] : {};
     // 判断传入的obj存在，且类型为对象
     if (obj && typeof obj === 'object') {
       for(key in obj) {
         // 如果obj的子元素是对象，则进行递归操作
         if(obj[key] && typeof obj[key] ==='object') {
           newObj[key] = this.iterator(obj[key])
         } else {
         // // 如果obj的子元素不是对象，则直接赋值
           newObj[key] = obj[key]
         }
       }
     }
     return newObj // 返回新对象
  }
  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };
  onChange=(title,e)=>{
    let data = this.state.items
    let keys = this.state.keys
    for (let i=0; i<data.length;i++){
      if(data[i].dataIndex==title){
        data[i].ischecked = !data[i].ischecked
        if(keys.indexOf(data[i].title)<0){
          keys.push(data[i].title)
        }
      }
    }
    this.setState({
      items:data,
      keys
    })
    e.stopPropagation()
  }
  close=(status,e)=>{
    let {keys} = this.state
    let columns = this.props.columns
    if(keys.length>0){
      for (let a=0;a<keys.length;a++){
          for(let b =0;b<columns.length;b++){
            if(keys[a] == columns[b].title){
              columns[b].ischecked = !columns[b].ischecked
            }
          }
      }
    }
    this.setState({
      items:columns
    },()=>{
      this.props.close(status,e)
    })

  }
  sub=()=>{
    let flag = false
    for(let a=0;a<this.state.items.length;a++){
      if(this.state.items[a].ischecked==true){
        flag=true
      }
    }
    if(flag){
      this.props.sub(this.state.items)
    }else {
      alert('请至少选择1列数据')
    }
  }
  isSelect=(dataIndex)=>{
    let keys =  this.state.keys
    for (let i=0; i<this.state.items.length;i++){
      if(this.state.items[i].dataIndex == dataIndex ){
        if(this.state.items[i].ischecked){
          return true
        }else {
          return false
        }
      }
    }
  }
  render() {
    const {intl} = this.props.currentLocale
    const SortableItem = SortableElement(({value}) =>
      <div className= {`${style.list} dndItem`}>
        <Checkbox onChange={this.onChange.bind(this,value.dataIndex)} checked={this.isSelect(value.dataIndex)}>{value.title}</Checkbox>
      </div>
    );

    const SortableList = SortableContainer(({items}) => {
      return (
        <div className={style.sortdnd}>
          <ul className={style.box}>
            <div className={style.title}>
              <span>显示\移动</span>
              <Icon onClick={this.close.bind(this,'close')} className={style.close} type="close-circle" />
            </div>
            <div className={style.listBox}>
              {items.map((value, index) => (
                value.title &&(
                  <SortableItem key={`item-${index}`} index={index} value={value} />
                )

              ))}
            </div>
            <Button type="primary" block  onClick={this.sub}>确定</Button>
          </ul>
        </div>

      );
    });
    return <SortableList helperClass={'dndList'} items={this.state.items} onSortEnd={this.onSortEnd} />;
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(SortableComponent);

import React,{Component} from 'react';
import {Modal} from 'antd';

class MapModal extends Component{
    constructor(props){
        super(props)
        
        this.state = this.props.stateP
        // this.setState({
        //   mapObj:null
        // })
           
    }

    componentDidMount(){
       setTimeout(()=>{
        this.mapFunc();
       },1000)
        //.log(this.state)
    }

    
    mapFunc = ()=>{
        let self = this
        let geoc = new BMap.Geocoder(); 
    
        let map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(104.794641,34.240545),5); 
        function theLocation(mapObj){
            // map.clearOverlays(); 
            var new_point = new BMap.Point(mapObj.lng,mapObj.lat);
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);              // 将标注添加到地图中
            map.panTo(new_point); 
            self.setState({
              lngLat:true
            })
        }
         map.enableScrollWheelZoom()
        if(this.state.mapObj){
          theLocation(this.state.mapObj)
        }
        
         map.setDefaultCursor("crosshair")
        function ZoomControl(){
          // 默认停靠位置和偏移量
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(10, 10);
        }
    
        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();
        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        ZoomControl.prototype.initialize = function(map){
          // 创建一个DOM元素
          let input = document.createElement("Input");
          input.setAttribute("placeholder","请输入你要选择的城市,按回车键搜索")
          input.setAttribute("id","inputId")
       
          input.style.width = "300px";
          input.style.border = "1px solid gray";
          input.style.backgroundColor = "white";
          input.addEventListener('keydown',function(e){
              
              if(e.keyCode === 13 ){
                  let inputValue  = input.value
                  if(inputValue!=''){
                    var local = new BMap.LocalSearch(map, {
                      renderOptions:{map: map}
                    });
                    local.search(inputValue);
                  }
                  e.preventDefault(); //阻止默认行为,会有兼容问题
                  // 其他代码
              }
          });
          
    
          // 添加DOM元素到地图中
          map.getContainer().appendChild(input);
          // 将DOM元素返回
          return input;
        }
    
        // 创建控件
          var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        map.addControl(myZoomCtrl);
    
        map.addEventListener("click",function(e){
          if(self.state.lngLat){
            var allOverlay = map.getOverlays();
            for (var i = 0; i < allOverlay.length ; i++){
                map.removeOverlay(allOverlay[i]);
              
            } 
          }
          let point = e.point
    
          geoc.getLocation(point, function(rs){
            let addComp = rs.addressComponents;
            let address = addComp.province + "," + addComp.city + "," + addComp.district
    
            // address = address.replace(/,/g,"")
    
            let infoObj = self.state.info
            infoObj.address = address
            self.setState({
              info: infoObj
            })
            // alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
          }); 
    
          let marker = new BMap.Marker(new BMap.Point(point.lng,point.lat));
          map.addOverlay(marker);
      
          self.setState({
            lngLat:true,
            mapObj:{"lng":e.point.lng,"lat":e.point.lat}
          },()=>{
            // self.props.refreshState(self.state)
          })
      
        });
      }

    handlerOK = ()=>{
        this.props.refreshState(this.state)
    }
    
    render(){
        return (
        <Modal
            title="选取项目地点"
            visible={true}
            onOk={this.handlerOK}
            onCancel={this.props.MapModalCancel}
        >
          <div id="allmap"  style={{"height":500,"width":"90%"}}></div>

        </Modal>
        )
    }
}

export default MapModal
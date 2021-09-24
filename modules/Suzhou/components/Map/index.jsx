import React, { Component } from 'react'
import {Modal} from 'antd';
import {Map, Marker, NavigationControl, InfoWindow,Boundary,PointLabel,ScaleControl} from 'react-bmap'
class MapAddress extends Component{
    constructor(props){
        super(props);
        this.state = {
            showMap:false,
        }
    }
    componentDidMount(){
        // this.init();
        this.getAdd(this.props.address);
    }
    getAdd = (keyword)=>{
        const myGeo = new BMap.Geocoder();
        myGeo.getPoint(keyword, (point) => {
          if (point) {
            //这个point就是解析地址获得的百度地图坐标系
            this.setState({
                lat:point.lat,
                lng:point.lng,
                showMap:true
            })
          } else {
          }
        });
    }
    //关闭
    handleCancel = (e) => {
        this.props.handleCancel();
    };
    render(){
        return(
            <div>
                <Modal title={this.props.title} visible={this.props.modalVisible}
                    onCancel={this.handleCancel}
                    width="800px"
                    footer={null}
                >
                    {/* <div id="container" style={{width:'300'}}>aa</div> */}
                    {this.state.showMap && (
                        <Map center={{lng: `${this.state.lng}`, lat:`${this.state.lat}`}} zoom="13" roam='true' enableScrollWheelZoom>
                            <Marker position={{lng:`${this.state.lng}`, lat:`${this.state.lat}`}}/>
                            <NavigationControl />
                            <ScaleControl />
                        </Map>
                    )}
                </Modal>
            </div>
        )
    }
}
export default MapAddress;
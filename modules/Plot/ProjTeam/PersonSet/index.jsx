import React,{Component} from 'react';
import  style from './index.less'
import {TokenKey} from "@/modules/Suzhou/components/Util/firstLoad";
class SupplementaryList extends Component{
    constructor(props) {
        super(props)
        this.state = { 
            SegID:'',
            tokenKey:''
        }
      }
    componentDidMount(){
        const SegID = this.props.rightData?this.props.rightData.pgSectionId:null;
        this.setState({SegID});
        TokenKey().then(res=>{
            this.setState({tokenKey:res.tokenkey})
        })
    }
    render(){
        return(
            <div className={style.main}>
                <h3 className={style.listTitle}>人员配置</h3>
                <div className={style.mainScorll}>
                    {this.state.tokenKey && (
                        <iframe className={style.content} frameBorder="0"  src={`http://iepms.sz-mtr.com:8504/Modules/EngineeringExtension/PersonListEdit.aspx?vmode=NwyELZTv0jbg7KXbDbD81w&SegID=${this.state.SegID}&GCTokenKey=${this.state.tokenKey}`} />
                    )}
                </div>
            </div>
        )
    }
}
export default SupplementaryList;
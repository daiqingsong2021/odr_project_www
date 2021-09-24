// axios中请求配置有baseURL选项，表示请求URL公共部分。
// `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
// export const baseURL = 'http://192.168.3.150:8765'
// export const baseURL = 'http://192.168.3.101:8765'
// export const baseURL = 'http://192.168.3.111:8765'
// export const baseURL = 'http://192.168.3.125:18080/'
// export const baseURL = 'http://192.168.3.111:8765'
// export const baseURL = 'http://192.168.3.104:8765'
// export const baseURL = 'http://192.168.3.130:8765' //合同
// export const baseURL = 'http://127.0.0.1:8765'
// export const baseURL = 'http://211.159.140.200:8765'
// const URL = '//192.168.2.68:8765'
// const URL = '//192.168.4.140:8765'
// const URL = '//192.168.4.63:8765'

const arr = [];
export const URL = () => {
    return new Promise((resolve, reject) => {
        // const URL = JSON.parse(localStorage.getItem('baseURL'))
        const URL = 'http://'+window.location.host;
        if(URL){
            arr.push(URL);  
            resolve(URL);
        }else{
            reject('');
        }
    })
}

export const url = URL().then(res=>{
    return res
});
export const baseURL =  arr[0];
// export const baseURL = process.env.API || URL

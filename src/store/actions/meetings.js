/**
 * Created by Administrator on 2017/12/21/021.
 */
import axios from 'axios'

export default {
  //获取家属注册信息列表
  getMeetings:({commit},regs) => {
    axios.get('../../../mock/meetings.json',{
      params:regs
    }).then(res => {
      commit('getMeetings',res.data);
    }).catch(err =>{
      console.log(err);
    })
  },
  //授权家属注册信息列表
  authorizeMeetings:({commit},regs) => {
    let id = regs.id;
    delete regs.id;
    axios.get('../../../mock/authorizations-meetings.json',{
      params:regs
    }).then(res => {
      commit('authorizeMeetings',res.data);
    }).catch(err => {
      console.log(err);
    })
  }
}

/**
 * Created by Administrator on 2017/12/22/022.
 */
export default {
  getPrisoners(state, prisonersList) {
    let prisoners = prisonersList.data.prisoner_data;
    let families = prisonersList.data.families_data;
    //将服刑人员对应的家属人员信息合并到服刑人员列表当中
    for(let family of families) {
      for(let prisoner of prisoners) {
        if(family[0].prisoner_id == prisoner.id) {
          Object.assign(prisoner,{'families':family});
        }
      }
    }
    state.PRISONERS.prisonerList = prisoners;
    state.PRISONERS.total = prisonersList.recordsTotal[0]['COUNT(*)'];
  }
}

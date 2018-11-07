import Param from 'variables'
import * as Lib from "platform/plain"

const apiUrl = (path) => `${Param.Api.root}${path}`

export default {
  findNews(data, success, failure) {
  //   $.ajax({
  //     url: 'https://de6ot4ou02.execute-api.ap-northeast-1.amazonaws.com/dev/news/topview/?1505632976939',
  //     method: 'get',
  //     // crossDomain: true,
  // }).done(function(response) {
  //     console.log(response);
  // });
    Lib.Ajax.get(apiUrl('news/list/'+ ( data.LastEvaluatedKey ? data.LastEvaluatedKey : "")), data, success, failure)
  },
  findNewsTopView(data, success,failure) {
    Lib.Ajax.get(apiUrl('news/topview/'+ ( data.LastEvaluatedKey ? data.LastEvaluatedKey : "")), data, success, failure);
  },
  getNewsDetail(data, success,failure) {
    Lib.Ajax.get(apiUrl('news/'+ data.id ),data,success,failure)
  },
  findComment(data, success,failure) {
    Lib.Ajax.get(apiUrl('comment/'+ data.article_id + "/" +  ( data.LastEvaluatedKey ? data.LastEvaluatedKey : "") ),data,success,failure)
  },
  postComment(data, success,failure) {
    Lib.Ajax.post(apiUrl('comment/'+ data.article_id ),data,success,failure)
  },
  putLike(data,success,failure) {
    Lib.Ajax.get(apiUrl('news/'+ data.article_id + "/" +  data.type) ,data,success,failure)
  }
}
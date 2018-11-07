<template lang="pug">
.l-content
  Message(global=true, globalKey="CommentPost")
  .row.l-row
    .col-xs-12.col-sm-10
      InputTextArea(field="comment", placeholder="コメント", suffixType="text",
        v-model="item.comment", :updating="updating")
    .col-xs-4.col-sm-2
      CommandButton(@click="register", :updating="updating") 投稿
</template>


<script lang="babel">
import {Action} from "~/constants"
import ViewCrud from "~/pages/mixins/view-crud"

// import api from "api/asset"
export default {
  mixins: [ViewCrud],
  data() {
    return {
      item: {
        comment: "",
        name: "",
      }
    }
  },
  methods: {
    registerData() {
      this.item.name = ""
      return this.item
    },
    action(param, success, failure) {
      param.article_id = this.$route.params.id;

      api.postComment(param, (v) => {
        this.clear() // 入力情報の初期化
        EventEmitter.$emit(Action.UpdateAsset, v)
        success(v, 'コメントを投稿しました')
      }, failure)
    }
  }

}
</script>
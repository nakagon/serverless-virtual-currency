<template lang="pug">
.col-xs-6.col-sm-6.col-no-padding
  LikeButton(@click="register", :updating="updating", :type="type" ,v-bind:icon="icon", 
  v-bind:count="count", v-bind:disable="disabled")
</template>

<script lang="babel">
import {Action} from "~/constants"
import ViewCrud from "~/pages/mixins/view-crud"

import api from "~/api/asset"
export default {
  mixins: [ViewCrud],
  data() {
    return {
      disabled : false,
      cnt: this.$props.count,
      item: {
        type: "",
      }
    }
  },
  props: {
    count   : { type: Number , default: 0 },
    type    : { type: String , default: ""},
    icon    : { type: String , default: ""},
  },
  methods: {

    registerData() {
      return this.item
    },
    action(param, success, failure) {
      param.article_id = this.$route.params.id;
      param.type       = this.type;
      this.cnt = this.cnt + 1
      api.putLike(param, (v) => {
        EventEmitter.$emit(Action.UpdateAsset, v)
        this.disabled = true;
        success(v)
      }, failure)
    },

  }

}
</script>
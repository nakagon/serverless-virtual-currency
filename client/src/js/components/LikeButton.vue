<style lang="scss">
.like {
  color:#FF66FF;
  font-weight:bold;
}
.dislike {
  color:#6699FF;
  font-weight:bold;

}

</style>

<template lang="pug">
  .l-item-button.btn(@click="onClick", v-bind:disabled="disable")
    i.fa.fa-fw(v-bind:class="[icon, a]").fa-xs
    .l-item-likenumber {{count}}
      slot
      i.fa.fa-spinner.fa-spin(v-if="updating")
</template>

<script lang="babel">
export default {
  name: 'like-button',
  data() {
    return{
      a: (this.type == "like") ? "like" : "dislike"
    }
  },
  props: {
    type: { type: String , default : "like"},
    updating: {type: Boolean, default: false},
    count: {type: Number , default: 0 },
    disable: { type : Boolean , default: false},
    icon: { type : String, default: "fa-smile-o"},
    test: { type: String , default : "fa-smile-o"},

  },
  methods: {
    onClick(e) {
      if (this.disable == false) {
        this.$emit('click', e)
      }
    }

  }
}
</script>
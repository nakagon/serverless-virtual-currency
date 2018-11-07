
<template lang="pug">
  ListGroup(fixed=true, @bottom="next", :updating="updating").l-list-body
    ul.list-group.clearfix(v-for="item in list")
      <router-link :to="{ name: 'newsDetail', params: { id: item.id }}">
        li.list-group-item.clearfix
          .l-item.l-item-day {{item.publishAt | day }} {{item.publishAt | time }}
          .l-item {{item.title}}
          .l-item.l-item-type 
            .label.label-default {{item.score}}
          .l-item.l-item-currency.pull-right  {{item.score}} views
          .l-item.l-item-amount.pull-right 
            <img :src="item.image" width="100px" v-if="item.image" />
      </router-link>
    <infinite-loading @infinite="infiniteHandler" :distance="distance" ref="infiniteLoading">
      <span slot="no-more">
      </span> 
    </infinite-loading>
</template>
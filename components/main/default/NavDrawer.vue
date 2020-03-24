<template>
  <v-navigation-drawer v-model="drawer" :mini-variant="mini" stateless app>
    <v-list>
      <!-- Single Items -->
      <v-list-item color="grey" v-for="item in items" :key="item.title" :to="item.to" exact>
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{item.title}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Multi Items -->
      <v-list-group
        color="grey"
        :prepend-icon="multiItem.icon"
        v-for="multiItem in multiItems"
        :key="multiItem.title"
      >
        <template v-slot:activator>
          <v-list-item color="grey">
            <v-list-item-title>{{multiItem.title}}</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          color="grey"
          v-for="child in multiItem.items"
          :key="child.title"
          :to="child.to"
          exact
        >
          <v-list-item-action>
            <v-icon>{{child.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-title>{{child.title}}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import Items from "@/items/navbar.json";
export default {
  props: ["miniBind", "drawerBind"],
  data() {
    return {
      title: "Backend Myanime",
      drawer: true,
      mini: true,
      items: [],
      multiItems: [],
      background: true
    };
  },
  async mounted() {
    this.items = Items.items;
    this.multiItems = Items.multiItems;
  },
  computed: {
    bg() {
      return this.background ? "https://i.imgur.com/pj0h7aO.jpg" : undefined;
    }
  },
  watch: {
    miniBind(val) {
      this.mini = val;
    },
    drawerBind(val) {
      this.drawer = val;
    }
  }
};
</script>
<style scoped>
.nuxt-link-active {
  text-decoration: none;
  color: #fff;
}
</style>
<template>
  <v-app-bar fixed app collapse-on-scroll dark flat>
    <v-btn v-if="$vuetify.breakpoint.smAndUp" icon @click.stop="miniVariant">
      <v-icon>mdi-{{ `chevron-${mini ? 'right' : 'left'}` }}</v-icon>
    </v-btn>
    <v-btn icon v-if="$vuetify.breakpoint.xsOnly" @click="drawerClose">
      <v-icon>mdi-{{drawer ? 'close' : 'plus' }}</v-icon>
    </v-btn>
    <v-toolbar-title class="text-uppercase grey--text">
      <nuxt-link to="/">
        <span class="font-weight-light">{{title}}</span>
      </nuxt-link>
    </v-toolbar-title>
    <v-spacer />
    <v-menu
      transition="slide-x-transition"
      offset-y
      bottom
      left
      :nudge-width="100"
      :nudge-bottom="10"
    >
      <template v-slot:activator="{ on }">
        <v-btn dark icon v-on="on">
          <v-avatar>
            <v-img :src="avatar"></v-img>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-btn text block to="/user/profile">
            <v-icon class="pr-2">mdi-account</v-icon>Profile
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn @click="logout" text block>
            <v-icon class="pr-2">mdi-exit-to-app</v-icon>Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import Items from "@/items/navbar.json";
import { signOut } from "@/services/Authentication";
export default {
  data() {
    return {
      title: "Backend Myanime",
      drawer: true,
      items: [],
      multiItems: [],
      mini: true,
      scroll: true
    };
  },
  created() {
    this.$emit("miniEmit", this.mini);
  },
  computed: {
    avatar() {
      return this.$store.state.auth.profile.avatar;
    }
  },
  async mounted() {
    this.items = Items.items;
    this.multiItems = Items.multiItems;
  },
  methods: {
    async logout() {
      this.$cookies.remove("USER_ACCESS_TOKEN");
      this.$store.commit("setAuth", false);
      this.$router.push({ path: "/" });
    },
    miniVariant() {
      this.mini = !this.mini;
      this.$emit("miniEmit", this.mini);
    },
    drawerClose() {
      this.drawer = !this.drawer;
      this.$emit("drawerEmit", this.drawer);
      if (this.mini === false) {
        this.$emit("miniEmit", (this.mini = true));
      }
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

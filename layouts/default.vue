<template>
  <v-app dark>
    <no-ssr>
      <NavDrawer :miniBind="mini" :drawerBind="drawer" />
      <NavBar @miniEmit="(data) => mini = data" @drawerEmit="(data) => drawer = data" />
    </no-ssr>
    <v-content>
      <v-container grid-list-xs>
        <SnackBar />
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "@/components/main/default/NavBar";
import NavDrawer from "@/components/main/default/NavDrawer";
import Authentication from "@/services/Authentication";
import SnackBar from "@/components/modules/SnackBar";
export default {
  middleware: 'auth',
  data() {
    return {
      mini: false,
      drawer: true
    };
  },
  components: {
    NavBar,
    SnackBar,
    NavDrawer
  }
};
</script>
<style>
.text-control {
  text-decoration: none;
  color: white;
}
.text-control:hover {
  text-decoration: underline;
  color: lightblue;
}

.delete-post:hover {
  cursor: pointer;
  color: lightblue;
  text-decoration: underline;
}
.term-flag {
  width: 21px;
}
.trusted-flag {
  font-size: 14px !important;
  user-select: none;
  color: #1da1f2 !important;
}
</style>

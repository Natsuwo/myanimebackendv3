<template>
  <v-layout row wrap>
    <v-flex xs6 md3 v-for="(item, index) in items.items" pr-2 pb-2 :key="index">
      <v-card>
        <v-layout row wrap pa-3>
          <v-icon v-if="$vuetify.breakpoint.xsOnly" class="dashboard-icon" size="30">{{item.icon}}</v-icon>
          <v-icon v-else class="dashboard-icon" size="60">{{item.icon}}</v-icon>
          <v-flex>
            <div class="right">
              <h2 class="dashboard-title">{{item.title}}</h2>
              <h2 class="dashboard-count">{{item.count}}</h2>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { dashboard } from "@/services/Dashboard";
export default {
  head() {
    return {
      title: "Admin"
    };
  },
  asyncData({ store, error }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    return dashboard(headers).then(resp => {
      var result = resp.data;
      return {
        dashboard: result.data
      };
    });
  },
  computed: {
    items() {
      return {
        items: [
          {
            icon: "mdi-movie",
            title: "Animes",
            count: this.dashboard.animes
          },
          {
            icon: "mdi-library-video",
            title: "Episodes",
            count: this.dashboard.episodes
          },
          {
            icon: "mdi-account",
            title: "Users",
            count: this.dashboard.users
          },
          {
            icon: "mdi-comment",
            title: "Comments",
            count: this.dashboard.comments
          }
        ]
      };
    }
  }
};
</script>
<style scoped>
.dashboard-title {
  color: #aaa;
}
.dashboard-count {
  color: #2196f3;
}
.dashboard-icon {
  user-select: none;
}
</style>

<template>
  <div>
    <h1>{{title}} ({{count}})</h1>
    <v-btn :to="'add-new'" color="primary">Add New</v-btn>
    <v-btn :to="'add-multi'" color="green">Add Multi</v-btn>
    <div class="text-center">
      <v-pagination
        @input="onPageChange"
        v-model="page"
        :length="meta.totalPage"
        :total-visible="7"
      ></v-pagination>
      <div class="layout">
        <v-spacer></v-spacer>
        <v-flex xs6 pt-3>
          <v-text-field
            @input="searchTimeOut(onPageChange)"
            v-model="search"
            solo-inverted
            clearable
            label="Search anime name"
            append-icon="mdi-magnify"
          ></v-text-field>
        </v-flex>
        <v-spacer></v-spacer>
      </div>
    </div>
    <no-ssr>
      <v-data-table
        :items="episodes"
        :headers="headers"
        class="elevation-1 my-table"
        :items-per-page="20"
        hide-default-footer
      >
        <template v-slot:item.anime_title="{ item }">{{ getTitle(item.anime_id) }}</template>
        <template v-slot:item.updated_at="{ item }">{{ getTime(item.updated_at) }}</template>
        <template v-slot:item.control="{ item }">
          <v-icon @click="editEpisode(item.episode_id)">mdi-pencil</v-icon>
          <v-icon @click.ctrl="removeEpisode(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </no-ssr>
    <div class="text-center pt-4">
      <v-pagination
        @input="onPageChange"
        v-model="page"
        :length="meta.totalPage"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import { get, removeEpisode } from "@/services/Episode";
import HEADERS from "@/items/episodetab.json";
export default {
  head() {
    return {
      title: this.title
    };
  },
  asyncData({ store }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    var limit = 10;
    var page = 1;
    var search = "";
    return get(headers, limit, page, search).then(resp => {
      var result = resp.data;
      var { count, data, meta, animes } = result;
      return {
        reqHeaders: headers,
        episodes: data,
        count,
        meta,
        animes,
        limit,
        page,
        search
      };
    });
  },
  data() {
    return {
      title: "Episodes",
      headers: HEADERS
    };
  },
  methods: {
    getTitle(id) {
      return this.animes.filter(x => x.anime_id === id)[0].title || "";
    },
    async onPageChange() {
      var headers = this.reqHeaders;
      var response = await get(headers, this.limit, this.page, this.search);
      var result = response.data;
      var { count, data, meta, animes } = result;
      this.episodes = data;
      this.count = count;
      this.meta = meta;
      this.animes = animes;
      this.page = 1;
    },
    async searchTimeOut(cb) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        return cb();
      }, 500);
    },
    getTime(time) {
      var date = new Date(time);
      var dd = String(date.getDate()).padStart(2, "0");
      var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = date.getFullYear();
      var expired = mm + "/" + dd + "/" + yyyy;
      if (isNaN(mm, dd, yyyy)) {
        expired = "Never";
      }
      return expired;
    },
    async removeEpisode(item) {
      var headers = this.reqHeaders;
      var form = {
        episode_id: item.episode_id
      };
      var response = removeEpisode(headers, form);
      const index = this.episodes.indexOf(item);
      if (index >= 0) this.episodes.splice(index, 1);
    },
    editEpisode(id) {
      this.$router.push({ path: `edit/${id}` });
    }
  }
};
</script>


<style scoped>
.text-control {
  text-decoration: none;
  color: white;
}
.text-control:hover {
  text-decoration: underline;
  color: lightblue;
}
</style>

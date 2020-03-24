<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md10 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{`Edit anime (${anime.title})`}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <img :src="anime.thumb" height="150" v-if="anime.thumb" />
          <v-text-field filled v-model="anime.thumb" label="Thumbnail"></v-text-field>
          <img :src="anime.thumbPortrait" height="150" v-if="anime.thumbPortrait" />
          <v-text-field filled v-model="anime.thumbPortrait" label="Thumbnail Portrait"></v-text-field>
          <v-text-field filled v-model="anime.title" label="Romaji Title"></v-text-field>
          <v-text-field filled v-model="anime.en_title" label="English Title"></v-text-field>
          <v-text-field filled v-model="anime.jp_title" label="Japan Title"></v-text-field>
          <v-text-field filled v-model="anime.premiered" label="Premiered"></v-text-field>
          <v-text-field filled v-model="anime.studios" label="Studios"></v-text-field>
          <v-text-field filled v-model="anime.season" label="Season"></v-text-field>
          <Type :data="anime.type" @typeEmit="(data) => anime.type = data" />
          <Genres :data="anime.genres" @genresEmit="(data) => anime.genres = data" />
          <v-textarea filled v-model="anime.description" name="input-7-1" label="Descriptions"></v-textarea>
          <v-divider></v-divider>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :loading="isUpdating" color="primary" @click="sumbit(true)">
            <v-icon left>mdi-update</v-icon>Update now
          </v-btn>
          <v-btn color="error" @click="deletePost()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { postUpdate, getUpdate, removeAnime } from "@/services/Anime";
import Genres from "@/components/anime/text-field/Genres";
import Type from "@/components/anime/text-field/Type";
export default {
  asyncData({ store, params }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    var id = params.id;
    return getUpdate(headers, id).then(resp => {
      var { data } = resp.data;
      var { anime } = data;
      return {
        headers,
        anime
      };
    });
  },
  components: {
    Genres,
    Type
  },
  head() {
    return {
      title: this.anime.title
    };
  },
  data() {
    return {
      isUpdating: false
    };
  },
  methods: {
    async sumbit() {
      this.isUpdating = true;
      var formData = new FormData();
      var anime_id = this.$route.params.id;
      formData.append("data", JSON.stringify(this.anime));
      var response = await postUpdate(this.headers, formData);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });

      if (response) {
        setTimeout(() => {
          this.isUpdating = false;
        }, 1000);
      }
    },
    async deletePost() {
      var form = {
        anime_id: this.$route.params.id
      };
      var response = await removeAnime(this.headers, form);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
      if (response.data.success) {
        setTimeout(() => {
          this.$router.push({ path: "/admin/anime/edit" });
        }, 1000);
      }
    }
  }
};
</script>
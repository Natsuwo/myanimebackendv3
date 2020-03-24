<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md10 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <img :src="formData.thumb" height="150" v-if="formData.thumb" />
          <v-text-field filled v-model="formData.thumb" label="Thumbnail"></v-text-field>
          <img :src="formData.thumbPortrait" height="150" v-if="formData.thumbPortrait" />
          <v-text-field filled v-model="formData.thumbPortrait" label="Thumbnail Portrait"></v-text-field>
          <v-text-field filled v-model="formData.title" label="Romaji Title"></v-text-field>
          <v-text-field filled v-model="formData.en_title" label="English Title"></v-text-field>
          <v-text-field filled v-model="formData.jp_title" label="Japan Title"></v-text-field>
          <v-text-field filled v-model="formData.premiered" label="Premiered"></v-text-field>
          <v-text-field filled v-model="formData.studios" label="Studios"></v-text-field>
          <v-text-field filled v-model="formData.season" label="Season"></v-text-field>
          <Type @typeEmit="(data) => formData.type = data" />
          <Genres @genresEmit="(data) => formData.genres = data" />
          <v-textarea filled v-model="formData.description" name="input-7-1" label="Descriptions"></v-textarea>
          <v-btn color="primary" @click="sumbit">Submit</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { addNew } from "@/services/Anime";
import Genres from "@/components/anime/text-field/Genres";
import Type from "@/components/anime/text-field/Type";
export default {
  components: {
    Genres,
    Type
  },
  head() {
    return {
      title: this.title
    };
  },
  data() {
    return {
      formData: {},
      title: "Add new (Anime)"
    };
  },
  methods: {
    async sumbit() {
      var headers = {
        "X-User-Session": this.$store.state.auth.userToken
      };
      var formData = new FormData();
      formData.append("data", JSON.stringify(this.formData));
      var response = await addNew(headers, formData);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });

      if (response.data.success) {
        setTimeout(() => {
          this.$router.push({
            path: `/admin/anime/edit/${response.data.anime_id}`
          });
        }, 1000);
      }
    }
  }
};
</script>
<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md10 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{title}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="form" v-if="isCrawl">
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
            <Type :data="formData.type" @typeEmit="(data) => formData.type = data" />
            <Genres :data="formData.genres" @genresEmit="(data) => formData.genres = data" />
            <v-textarea filled v-model="formData.description" name="input-7-1" label="Descriptions"></v-textarea>
          </div>
          <v-text-field v-else v-model="link" label="Myanimelist link"></v-text-field>
          <v-btn v-if="!isCrawl" color="green" @click="check">Crawl</v-btn>
          <v-btn v-else color="primary" @click="sumbit">Submit</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { addNew, crawlAnime } from "@/services/Anime";
import { getId } from "@/plugins/crawl";
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
      link: "",
      thumb: "",
      thumbPortrait: "",
      formData: {},
      isCrawl: false,
      title: "Crawl (Anime)",
      headers: {
        "X-User-Session": this.$store.state.auth.userToken
      }
    };
  },
  computed: {
    dataGenres() {
      return this.$store.state.term.terms;
    }
  },
  methods: {
    async check() {
      var id = getId(this.link);
      var response = await crawlAnime(this.headers, { id });
      if (response.data.success) {
        var that = response.data.results;
        var genres = [];
        for (var item of that.genres) {
          var name = item.name;
          var genre = this.dataGenres.find(x => x.title === name);
          genres.push(genre.genre_id);
        }
        that.genres = genres;
        if (that.type === "TV") that.type = "TV Series";
        if (that.status === "Currently Airing") that.status = "Ongoing";
        else that.status = "Completed";
        this.formData = {
          title: that.title,
          type: that.type,
          premiered: that.premiered ? that.premiered.replace(/\D/g, "") : "",
          season: that.premiered,
          studios: that.studios ? that.studios[0].name : "",
          description: that.synopsis,
          thumb: this.thumb,
          thumbPortrait: this.thumbPortrait,
          en_title: that.title_english,
          jp_title: that.title_japanese,
          genres: that.genres
        };
        this.isCrawl = true;
      }
    },
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
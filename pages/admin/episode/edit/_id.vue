<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ titleHead }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <Anime
            :anime="episode.anime_id"
            :data="episode.anime_id"
            @episodeAnimeEmit="data => episode.anime_id = data"
            :disabled="true"
          />
          <v-text-field :rules="[rules.number]" v-model="episode.number" label="Number"></v-text-field>
          <v-text-field v-model="episode.caption" label="Caption"></v-text-field>
          <v-text-field v-model="episode.thumbnail" label="Thumbnail"></v-text-field>
          <v-textarea v-model="episode.description" label="Description"></v-textarea>
          <v-flex class="text-right">
            <v-btn @click="addNewApartment" color="info">Add Source</v-btn>
            <v-btn @click="submit" color="primary">Submit</v-btn>
            <v-btn @click="removeEpisode" color="red">Remove</v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md8 mt-4 v-for="(source, index) in episode.sources" :key="index">
      <v-card>
        <v-card-text>
          <Type :data="source.type" @episodeTypeEmit="data => source.type = data" />
          <Lang
            title="Audio"
            :lang="source.audio || ''"
            :langs="langs"
            @episodeLangEmit="data => source.audio = data"
          />
          <Lang
            title="Subtitle"
            :lang="source.subtitle || ''"
            :langs="langs"
            @episodeLangEmit="data => source.subtitle = data"
          />
          <v-text-field
            :rules="[rules.isValid, rules.required]"
            v-model="source.source"
            label="Source"
          ></v-text-field>
          <v-flex class="text-right">
            <v-btn @click="removeApartment(index)" color="red">Remove Source</v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md8 mt-4>
      <v-card>
        <v-card-text>
          <pre>{{episode.sources}}</pre>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Type from "@/components/episode/Type";
import Lang from "@/components/episode/Lang";
import Anime from "@/components/episode/Anime";
import { mapState } from "vuex";
import { getUpdate, update, removeEpisode } from "@/services/Episode";
import { getDriveId } from "@/plugins/valid";
import { isValid } from "@/plugins/valid";
export default {
  asyncData({ store, params, error }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    var id = params.id;
    return getUpdate(headers, id).then(resp => {
      var result = resp.data.result;
      var { episode } = result;
      return {
        headers,
        episode
      };
    });
  },
  computed: {
    ...mapState(["langs"])
  },
  components: {
    Type,
    Lang,
    Anime
  },
  head() {
    return {
      title: this.titleHead
    };
  },
  data() {
    return {
      titleHead: "Edit episode",
      rules: {
        number: v => /^[0-9]+$/.test(v) || "Number Only",
        required: v => !!v || "source is required",
        isValid: v => !v || isValid(v) || "Source not valid"
      }
    };
  },
  methods: {
    addNewApartment: function() {
      this.episode.sources.push({});
    },
    removeApartment: function(index) {
      this.episode.sources.splice(
        this.episode.sources.findIndex(w => w === index),
        1
      );
    },
    checkSource(url) {
      var id = getDriveId(url);
      return (this.episode.source = id);
    },
    async submit() {
      var response = await update(this.headers, this.episode);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
    },
    async removeEpisode() {
      var response = await removeEpisode(this.headers, this.episode);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
      if (response.data.success) {
        this.$router.push({ path: "/admin/episode/edit" });
      }
    }
  },
  watch: {
    number() {
      this.titleHead = `Edit episode (${this.number})`;
    }
  }
};
</script>

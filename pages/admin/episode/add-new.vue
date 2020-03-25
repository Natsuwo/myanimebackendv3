<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ titleHead }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <Anime
              :anime="form.anime_id"
              @episodeAnimeEmit="data => form.anime_id = data"
            />
            <v-text-field :rules="[rules.number]" v-model="form.number" label="Number"></v-text-field>
            <v-text-field v-model="form.caption" label="Caption"></v-text-field>
            <v-text-field v-model="form.thumbnail" label="Thumbnail"></v-text-field>
            <v-textarea v-model="form.description" label="Description"></v-textarea>
            <v-btn @click="addNewApartment" color="info">Add Source</v-btn>
            <v-btn @click="submit" :loading="loading" :disabled="loading" color="primary">Submit</v-btn>
            <v-switch color="primary" v-model="form.isNew" class="ma-2" label="Push to top?"></v-switch>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md8 mt-4 v-for="(source, index) in sources" :key="index">
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
          <v-text-field v-model="source.suffix" label="Suffix" hint="Horriblesubs"></v-text-field>
          <v-text-field :rules="[rules.required]" v-model="source.source" label="Source"></v-text-field>
          <v-flex class="text-right">
            <v-btn @click="removeApartment(index)" color="red">Remove Source</v-btn>
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md8 mt-4>
      <v-card>
        <v-card-text>
          <pre>{{sources}}</pre>
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
import { addNew } from "@/services/Episode";
import { mapMutations } from "vuex";
export default {
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
  computed: {
    ...mapState(["langs"])
  },
  data() {
    return {
      titleHead: "Add new (Episode)",
      sources: [{}],
      form: {},
      valid: true,
      loading: false,
      rules: {
        number: v => /^[0-9]+$/.test(v) || "Number Only",
        required: v => !!v || "source is required"
      }
    };
  },
  methods: {
    ...mapMutations("snackbar", ["snackBar"]),
    addNewApartment: function() {
      this.sources.push({});
    },
    removeApartment: function(index) {
      this.sources.splice(index, 1);
    },
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.loading = true;
      var headers = {
        "X-User-Session": this.$store.state.auth.userToken
      };
      this.form.sources = this.sources;
      var response = await addNew(headers, this.form);
      this.snackBar({ active: true, message: response.data });
      this.loading = false;
      if (response.data.success) {
        setTimeout(() => {
          this.$router.push({
            path: `/admin/episode/edit/${response.data.episode_id}`
          });
        }, 1000);
      }
    }
  }
};
</script>

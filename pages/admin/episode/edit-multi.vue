<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md8 v-if="!isSubmit">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ titleHead }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <div class="before-submit">
            <Anime
              :anime="form.anime_id"
              :data="form.anime_id"
              @episodeAnimeEmit="data => form.anime_id = data"
            />
            <v-text-field
              filled
              v-model="form.numbers"
              label="Episodes to-from"
              hint="1-12"
              autocomplete="off"
            ></v-text-field>
            <v-btn @click="findEpisodes(false)" color="purple">Find (only edit source)</v-btn>
            <v-btn @click="findEpisodes(true)" color="purple">Find (edit all)</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 md8 v-else>
      <v-card v-for="item in lists" :key="item.id" class="mb-4">
        <v-card-text>
          <div class="submit">
            <div v-if="isEditAll">
              <v-text-field filled v-model="item.caption" label="Caption"></v-text-field>
              <v-text-field filled v-model="item.number" label="Number"></v-text-field>
              <v-text-field filled v-model="item.thumbnail" label="Thumbnail"></v-text-field>
              <v-textarea filled v-model="item.description" label="Description"></v-textarea>
            </div>
            <div class="sources" v-for="(source, idx) in item.sources" :key="idx">
              <Type :data="source.type" @episodeTypeEmit="data => source.type = data" />
              <Lang
                :lang="source.audio || ''"
                :langs="langs"
                title="Audio"
                :data="source.audio"
                @episodeLangEmit="data => source.audio = data"
              />
              <Lang
                :lang="source.subtitle || ''"
                :langs="langs"
                title="Subtitle"
                :data="source.subtitle"
                @episodeLangEmit="data => source.subtitle = data"
              />
              <v-text-field v-model="source.suffix" label="Suffix" hint="Horriblesubs"></v-text-field>
              <v-text-field filled v-model="source.source" :label="item.caption"></v-text-field>
              <v-flex class="text-right">
                <v-btn @click="removeApartment(idx, item)" color="red">Remove Source</v-btn>
              </v-flex>
              <v-divider class="py-4" />
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-btn @click="isSubmit = !isSubmit" color="error">Go Back</v-btn>
      <v-switch color="primary" v-model="isNew" class="ma-2" label="Push to top?"></v-switch>
      <v-btn @click="submit" :loading="loading" :disabled="loading" color="primary">Submit</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
import Type from "@/components/episode/Type";
import Lang from "@/components/episode/Lang";
import Anime from "@/components/episode/Anime";
import { mapState } from "vuex";
import { getEditMulti, editMulti } from "@/services/Episode";
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
      titleHead: "Edit Multi (Episode)",
      form: {},
      lists: [],
      isNew: false,
      isSubmit: false,
      isEditAll: false,
      loading: false,
      headers: {
        "X-User-Session": this.$store.state.auth.userToken
      }
    };
  },
  methods: {
    removeApartment(index, item) {
      var idx = this.lists.indexOf(item);
      this.lists[idx].sources.splice(index, 1);
    },
    async submit() {
      this.loading = true;
      var response = await editMulti(this.headers, {
        isNew: this.isNew,
        lists: this.lists
      });
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
      this.loading = false;
      if (response.data.success) {
        return this.$router.push({ path: "/admin/episode/edit" });
      }
    },
    async findEpisodes(val) {
      this.isEditAll = val;
      var { anime_id, numbers } = this.form;
      var response = (await getEditMulti(this.headers, anime_id, numbers)).data;
      if (response.success) {
        this.lists = response.results;
        this.isSubmit = !this.isSubmit;
      } else {
        this.$store.commit("snackbar/snackBar", {
          active: true,
          message: response
        });
      }
    }
  }
};
</script>

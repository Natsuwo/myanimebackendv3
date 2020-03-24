<template>
  <v-autocomplete
    v-model="episode"
    :items="episodesData"
    chips
    label="Episode"
    item-text="title"
    item-value="episode_id"
    hide-selected
  >
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        class="chip--select-multi"
        @click:close="remove(data.item)"
      >
        <v-avatar left>
          <v-img :src="data.item.thumbPortrait + '?w=40&f=webp'"></v-img>
        </v-avatar>
        {{ data.item.title }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar>
          <img :src="data.item.thumbPortrait + '?w=40&f=webp'" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.title"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  props: ["animes", "episodes"],
  data() {
    return {
      episode: [],
      episodesData: [],
      rules: {
        required: v => !!v || "source is required"
      }
    };
  },
  mounted() {
    for (var item of this.episodes) {
      var { anime_id, episode_id } = item;
      var anime = this.animes.filter(x => x.anime_id === anime_id);
      if (anime.length > 0) {
        item.title = anime[0].title + " [" + item.number + "]";
        item.thumbPortrait = anime[0].thumbPortrait;
        this.episodesData.push(item);
      }
    }
  },
  methods: {
    remove(item) {
      this.episode = [];
    }
  },
  watch: {
    episode(val) {
      this.$emit("episodeAnimeEmit", val);
    }
  }
};
</script>
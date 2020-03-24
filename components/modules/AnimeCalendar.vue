<template>
  <v-autocomplete
    v-model="animeData"
    :items="animes"
    chips
    label="Anime"
    item-text="title"
    item-value="anime_id"
    hide-selected
    autocomplete="off"
    :disabled="disabled"
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
  props: ["animes", "anime", "disabled"],
  data() {
    return {
      animeData: [],
      rules: {
        required: v => !!v || "source is required"
      }
    };
  },
  mounted() {
    this.animeData = this.anime;
  },
  methods: {
    remove(item) {
      this.animeData = [];
    }
  },
  watch: {
    animeData(val) {
      this.$emit("calendarAnimeEmit", val);
    }
  }
};
</script>
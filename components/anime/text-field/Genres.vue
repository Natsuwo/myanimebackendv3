<template>
  <v-autocomplete
    filled
    v-model="dataGenres"
    :items="terms"
    chips
    label="Genres"
    item-text="title"
    item-value="genre_id"
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        class="chip--select-multi"
        @click:close="remove(data.item)"
      >{{ data.item.title }}</v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.title"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: ["data"],
  data() {
    return {
      dataGenres: []
    };
  },
  computed: {
    ...mapState("term", ["terms"])
  },
  created() {
    if (this.data) this.dataGenres = [...this.data];
  },
  methods: {
    async remove(item) {
      const index = this.dataGenres.indexOf(item.genre_id);
      if (index >= 0) this.dataGenres.splice(index, 1);
    }
  },
  watch: {
    dataGenres(val) {
      this.$emit("genresEmit", val);
    }
  }
};
</script>


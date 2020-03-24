<template>
  <v-autocomplete
    v-model="type"
    :items="dataType"
    chips
    label="Type"
    item-text="name"
    item-value="name"
    hide-selected
    autocomplete="off"
  >
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        class="chip--select-multi"
        @click:close="remove(data.item)"
      >{{ data.item.name }}</v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>
<script>
import Type from "@/items/episode-type.json";
export default {
  props: ["data"],
  data() {
    return {
      type: [],
      dataType: Type
    };
  },
  created() {
    if (this.data) this.type = this.data;
  },
  methods: {
    remove(item) {
      this.type = [];
    }
  },
  watch: {
    type(val) {
      this.$emit("episodeTypeEmit", val);
    }
  }
};
</script>
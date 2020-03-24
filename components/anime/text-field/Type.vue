<template>
  <v-autocomplete
    filled
    v-model="types"
    :items="dataTypes"
    chips
    label="Types"
    item-text="name"
    item-value="name"
  >
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        class="chip--select-multi"
        @click:close="remove"
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
import Types from "@/items/type.json";
export default {
  props: ["data"],
  data() {
    return {
      types: [],
      dataTypes: Types
    };
  },
  created() {
    if (this.data) this.types = this.data;
  },
  methods: {
    remove() {
      this.types = "";
    }
  },
  watch: {
    types(val) {
      this.$emit("typeEmit", val);
    }
  }
};
</script>

<template>
  <v-autocomplete
    v-model="days"
    :items="dataDays"
    chips
    label="Days"
    item-text="name"
    item-value="id"
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
import Days from "@/items/Days.json";
export default {
  props: ["data"],
  data() {
    return {
      days: "",
      dataDays: Days
    };
  },
  created() {
    if (this.data || this.data > -1) {
      this.days = this.data;
    }
  },
  methods: {
    remove() {
      this.days = "";
    }
  },
  watch: {
    days(val) {
      this.$emit("dayEmit", val);
    }
  }
};
</script>

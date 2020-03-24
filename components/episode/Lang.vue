<template>
  <v-autocomplete
    v-model="langData"
    :items="langs"
    chips
    :label="title"
    item-text="lang"
    item-value="lang_code"
    hide-selected
    autocomplete="off"
  >
    <template v-slot:selection="data">
      <v-chip
        :input-value="data.selected"
        close
        class="chip--select-multi"
        @click:close="remove(data.item)"
      >
        <v-avatar left>
          <v-img :src="data.item.flag"></v-img>
        </v-avatar>
        {{ data.item.key }}
      </v-chip>
    </template>
    <template v-slot:item="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content v-text="data.item"></v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-avatar tile>
          <img :src="data.item.flag" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.lang"></v-list-item-title>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  props: ["langs", "title", "lang"],
  data() {
    return {
      langData: []
    }
  },
  mounted() {
    this.langData = this.lang
  },
  methods: {
    remove(item) {
      this.langData = [];
    }
  },
  watch: {
    langData(val) {
      this.$emit("episodeLangEmit", val);
    }
  }
};
</script>
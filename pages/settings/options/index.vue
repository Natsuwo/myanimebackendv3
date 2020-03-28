<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs10>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ titleHead }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" v-if="!option || isCreate">
              <v-text-field filled v-model="form.name" label="Option Name"></v-text-field>
              <v-text-field filled v-model="form.settings.site_title" label="Site Title"></v-text-field>
              <v-text-field
                filled
                v-model="form.settings.descriptions"
                label="Descriptions"
                hint="watch anime online"
                persistent-hint
              ></v-text-field>
              <v-text-field
                filled
                v-model="form.settings.noti"
                label="Noti"
                hint="Fuc' haters!"
                persistent-hint
              ></v-text-field>
              <v-switch color="primary" v-model="form.default" class="ma-2" label="Set Default"></v-switch>
              <v-btn color="primary" @click="create">Create</v-btn>
            </v-col>
            <v-col cols="12" sm="6" v-else>
              <v-select
                v-model="option.id"
                :items="options"
                item-text="name"
                item-value="id"
                label="Options Select"
              ></v-select>
              <v-text-field filled v-model="option.settings.site_title" label="Site Title"></v-text-field>
              <v-text-field
                filled
                v-model="option.settings.descriptions"
                label="Descriptions"
                hint="watch anime online"
                persistent-hint
              ></v-text-field>
              <v-text-field
                filled
                v-model="option.settings.noti"
                label="Noti"
                hint="Fuc' haters!"
                persistent-hint
              ></v-text-field>
              <v-text-field
                filled
                v-model="option.settings.prev_season"
                label="Prev Season"
                hint="Fall 2019"
                persistent-hint
              ></v-text-field>
              <v-text-field
                filled
                v-model="option.settings.current_season"
                label="Current Season"
                hint="Fall 2019"
                persistent-hint
              ></v-text-field>
              <v-text-field
                filled
                v-model="option.settings.next_season"
                label="Next Season"
                hint="Fall 2019"
                persistent-hint
              ></v-text-field>
              <v-switch color="primary" v-model="option.default" class="ma-2" label="Set Default"></v-switch>
              <v-btn color="info" @click="isCreate = !isCreate">Create new</v-btn>
              <v-btn color="primary" @click="update">Update</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { getOption, createOption, updateOption } from "@/services/Options";
export default {
  head() {
    return {
      title: this.titleHead
    };
  },
  asyncData({ store, error }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    return getOption(headers).then(resp => {
      var { data } = resp.data;
      var { option, options } = data;
      return {
        headers,
        option,
        options
      };
    });
  },
  data() {
    return {
      isCreate: false,
      form: {
        name: "",
        settings: {}
      },
      titleHead: "Options"
    };
  },
  methods: {
    async create() {
      var response = (await createOption(this.headers, this.form)).data;
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response
      });
    },
    async update() {
      var response = (await updateOption(this.headers, this.option)).data;
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response
      });
    },
    remove(item) {
      this.form.season = "";
    }
  },
  watch: {
    "option.id"(val) {
      getOption(this.headers, val).then(resp => {
        var { data } = resp.data;
        var { option, options } = data;
        this.option = option;
        this.options = options;
      });
    }
  }
};
</script>
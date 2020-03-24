<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md10 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ titleHead }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field :rules="[rules.required]" v-model="form.username" label="Username"></v-text-field>
            <v-text-field :rules="[rules.required, rules.email]" v-model="form.email" label="Email"></v-text-field>
            <v-text-field
              :rules="[rules.required]"
              v-model="form.password"
              type="password"
              label="Password"
            ></v-text-field>
            <v-text-field
              maxlength="6"
              :rules="[rules.required, rules.number, rules.sixNumber]"
              v-model="form.pin"
              type="password"
              label="Pin"
            ></v-text-field>
            <v-autocomplete
              :rules="[rules.required]"
              v-model="form.role"
              :items="role"
              chips
              label="Role"
              item-text="name"
              item-value="id"
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
            <v-btn @click="addNew" color="primary">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import Role from "@/items/role.json";
import { signUp } from "@/services/Authentication";
export default {
  head() {
    return {
      title: this.titleHead
    };
  },
  data() {
    return {
      role: Role,
      valid: true,
      titleHead: "Add new user",
      form: {},
      rules: {
        required: v => !!v || "this field is required.",
        sixNumber: v => !v || v.length >= 6 || "Must required 6 numbers",
        email: v => /.+@.+/.test(v) || "E-mail must be valid",
        max: v => v.length <= 6 || 'Max 6 numbers',
        number: v => /^[0-9]+$/.test(v) || 'Number Only'
      }
    };
  },
  methods: {
    async addNew() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var headers = {
        "X-User-Session": this.$store.state.auth.userToken
      };
      var response = await signUp(headers, this.form);
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
    },
    remove() {
      this.form.role = "";
    }
  }
};
</script>
    
<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <v-form ref="form" @keyup.native.enter="updateProfile">
          <v-container py-0>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="profile.email" label="Email" disabled />
                <v-text-field v-model="form.cr_pass" type="password" label="Current Password" />
                <v-text-field v-model="form.new_pass" type="password" label="New Password" />
                <v-text-field
                  :rules="[rules.match_pass]"
                  v-model="form.re_pass"
                  type="password"
                  label="Repeat New Password"
                />
                <v-text-field
                  :rules="pinRules"
                  maxlength="6"
                  v-model="form.cr_pin"
                  type="password"
                  label="Current Pin"
                />
                <v-text-field
                  :rules="pinRules"
                  maxlength="6"
                  v-model="form.new_pin"
                  type="password"
                  label="New Pin"
                />
                <v-text-field
                  :rules="[rules.match_pin]"
                  maxlength="6"
                  v-model="form.re_pin"
                  type="password"
                  label="Repeat New Pin"
                />
              </v-flex>
              <v-flex xs12 text-right>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  class="mx-0"
                  @click="updateProfile"
                  color="green darken-4"
                >Update Profile</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-flex>
      <v-flex xs12 md4>
        <v-avatar slot="offset" class="mx-auto d-block" size="130">
          <img :src="avatarUrl" />
        </v-avatar>
        <v-card-text class="text-center">
          <h3 :class="`category ${role === 'Admin' ? 'red' : 'teal'}--text mb-3`">{{role}}</h3>
          <h2 class="card-title font-weight-light">{{profile.username}}</h2>
          <v-file-input v-model="avatar" type="file" accept="image/*" label="avatar"></v-file-input>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { profile, updateProfile } from "@/services/Authentication";
import { mapMutations } from "vuex";
import Role from "@/items/role.json";
export default {
  computed: {
    profile() {
      return this.$store.state.auth.profile;
    },
    role() {
      if (this.profile.role === 99) return "Admin";
      else
        return Role.filter(x => x.id === this.profile.role).map(x => x.name)[0];
    }
  },
  data() {
    return {
      avatar: [],
      avatarUrl: "",
      form: {},
      loading: false,
      pinRules: [
        v => !v || v.length >= 6 || "Must required 6 numbers",
        v => !v || v.length <= 6 || "Max 6 numbers",
        v => /^[0-9]+$/.test(v) || "Number Only"
      ],
      rules: {
        match_pass: v => v === this.form.new_pass || "Password not match.",
        match_pin: v => v === this.form.new_pin || "Pin not match."
      }
    };
  },
  created() {
    this.avatarUrl = this.profile.avatar;
  },
  methods: {
    ...mapMutations("snackbar", ["snackBar"]),
    async updateProfile() {
      var headers = {
        "X-User-Session": this.$store.state.auth.userToken
      };
      this.loading = true;
      var formData = new FormData();
      formData.append("form", JSON.stringify(this.form));
      formData.append(
        "avatar",
        this.avatar.size ? this.avatar : this.avatarUrl
      );
      var response = (await updateProfile(headers, formData)).data;
      this.snackBar({ active: true, message: response });
      this.loading = false
    }
  },
  watch: {
    avatar(file) {
      if (file && file.length === undefined) {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.addEventListener("load", () => {
          this.avatarUrl = fr.result;
        });
      }
      if (!file) {
        this.avatarUrl = "";
      }
    }
  }
};
</script>
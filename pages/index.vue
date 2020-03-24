<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs6>
      <h1>Backend Myanime</h1>
      <v-form ref="form" v-model="valid" @keyup.native.enter="submit">
        <v-text-field
          :rules="[rules.required]"
          v-model="email"
          label="email"
          prepend-icon="mdi-account"
        ></v-text-field>
        <v-text-field
          :rules="[rules.required]"
          v-model="password"
          type="password"
          label="Password"
          prepend-icon="mdi-lock"
        ></v-text-field>
        <v-text-field
          :rules="[rules.required, rules.sixNumber, rules.max, rules.number]"
          v-model="pin"
          type="password"
          maxlength="6"
          label="Pin"
          prepend-icon="mdi-lock"
        ></v-text-field>
        <v-btn color="green" @click="submit">Login</v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import { signIn } from "@/services/Authentication";
export default {
  async fetch({ store, redirect }) {
    if (store.state.auth.isLogin) {
      return redirect("/admin");
    }
  },
  head() {
    return {
      title: "Backend MyAnime"
    };
  },
  data() {
    return {
      email: "",
      valid: true,
      password: "",
      pin: "",
      rules: {
        required: v => !!v || "this field is required.",
        sixNumber: v => !v || v.length >= 6 || "Must required 6 numbers",
        max: v => v.length <= 6 || "Max 6 numbers",
        number: v => /^[0-9]+$/.test(v) || "Number Only"
      }
    };
  },
  methods: {
    async submit() {
      if (!this.$refs.form.validate()) {
        return;
      }
      var form = {
        email: this.email,
        password: this.password,
        pin: this.pin
      };
      var headers = {
        "X-User-Session": this.$store.state.auth.userToken
      };
      var login = (await signIn(headers, form)).data;

      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: login
      });

      if (login.success) {
        this.$cookies.set("USER_ACCESS_TOKEN", login.access, {
          path: "/",
          maxAge: 60 * 60 * 24 * 1
        });
        this.$store.commit("setAuth", {
          isLogin: true,
          token: login.access,
          user_id: login.user.user_id
        });
        this.$router.go({
          path: "/a/1",
          force: true
        });
        return this.$router.push({ path: "/admin" });
      }
    }
  },
  layout: "index"
};
</script>

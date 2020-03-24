<template>
  <v-layout row wrap justify-center align-center>
    <v-flex xs12 md10 md8>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Edit {{dataEdit.title}}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field v-model="dataEdit.title" label="Title"></v-text-field>
          <v-textarea v-model="dataEdit.description" name="input-7-1" label="Descriptions"></v-textarea>
          <v-btn @click="submit" color="primary">Update</v-btn>
          <v-btn @click="deleteTerm(term)" color="error">Delete</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  head() {
    return {
      title: this.title
    };
  },
  data() {
    return {
      dataEdit: "",
      title: "Edit genre",
      headers: { "X-User-Session": this.$store.state.auth.userToken }
    };
  },
  computed: {
    term() {
      var genre_id = this.$route.params.id;
      return this.$store.state.term.terms.find(
        x => x.genre_id === parseInt(genre_id)
      );
    }
  },
  async created() {
    this.dataEdit = JSON.parse(JSON.stringify(this.term));
  },
  methods: {
    async submit() {
      var formData = this.dataEdit;
      var response = await this.$store.dispatch("term/update", {
        item: this.term,
        headers: this.headers,
        formData
      });
      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response
      });
    },
    async deleteTerm() {
      var form = { genre_id: this.$route.params.id };
      var response = await this.$store.dispatch("term/deleteTerm", {
        item: this.term,
        headers: this.headers,
        form
      });

      if (response.success) {
        setTimeout(() => {
          this.$router.push({ path: "/admin/genre/edit" });
        }, 1000);
      }
    }
  }
};
</script>
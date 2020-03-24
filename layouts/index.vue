<template>
  <v-app dark style="background: #2d3a4b;">
    <v-layout row wrap justify-center align-center>
      <v-content class="text-center">
        <v-container>
          <SnackBar />
          <nuxt />
        </v-container>
      </v-content>
    </v-layout>
  </v-app>
</template>

<script>
import SnackBar from "@/components/modules/SnackBar";
export default {
  components: {
    SnackBar
  }
};
</script>

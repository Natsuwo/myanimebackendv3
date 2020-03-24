<template>
  <v-menu
    :ref="refx"
    v-model="startTime"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value.sync="time"
    transition="scale-transition"
    min-width="290px"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field v-model="time" :label="refx" dense readonly hide-details v-on="on"></v-text-field>
    </template>
    <v-time-picker color="green lighten-1" v-model="time">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="startTime = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs[refx].save(time)">OK</v-btn>
    </v-time-picker>
  </v-menu>
</template>
<script>
export default {
  props: ["refx", "on", "data"],
  data() {
    return {
      startTime: false,
      time: ""
    };
  },
  mounted() {
    this.startTime = this.on;
    this.time = this.data;
  },
  watch: {
    startTime(val) {
      this.$emit("cTimeOff", val);
    },
    time(val) {
      this.$emit("cTime", val);
    }
  }
};
</script>
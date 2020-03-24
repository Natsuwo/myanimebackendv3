<template>
  <v-row>
    <v-col sm="12" lg="12" class="pl-4">
      <v-btn color="primary" dark @click.stop="dialog = true" class="mb-4">New Event</v-btn>
      <v-sheet height="600">
        <v-calendar @click:event="showEvent" dark ref="calendar" :type="type" :events="events"></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card min-width="350px" flat>
            <v-card-actions>
              <v-layout align-center justify-center>
                <v-flex xs12 class="text-center">
                  <v-form @submit.prevent="updateEvent">
                    <AnimeCalendar
                      :disabled="true"
                      :anime="selectedEvent.anime"
                      :animes="animes"
                      @calendarAnimeEmit="(data) => selectedEvent.anime = data"
                      class="mt-4"
                    />
                    <DayCalendar
                      :data="selectedEvent.day"
                      @dayEmit="(data) => selectedEvent.day = data"
                    />
                    <TimeCalendar
                      refx="Start Time"
                      :on="startTime"
                      :data="selectedEvent.start_time"
                      @cTimeOff="(data) => startTime = data"
                      @cTime="(data) => selectedEvent.start_time = data"
                    />
                    <TimeCalendar
                      refx="End Time"
                      :on="endTime"
                      :data="selectedEvent.end_time"
                      @cTimeOff="(data) => startTime = data"
                      @cTime="(data) => selectedEvent.end_time = data"
                    />
                    <v-btn
                      type="submit"
                      color="primary"
                      class="mr-4 mt-4"
                      @click.stop="dialog = false"
                    >update event</v-btn>
                    <v-btn class="mr-4 mt-4" color="red" @click="removeEvent">Remove</v-btn>
                  </v-form>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
      <v-dialog v-model="dialog" max-width="850">
        <v-card class="pa-4">
          <v-container>
            <v-form @submit.prevent="addEvent">
              <AnimeCalendar
                :animes="animes"
                @calendarAnimeEmit="(data) => event.anime = data"
                class="mt-4"
              />
              <DayCalendar @dayEmit="(data) => event.day = data" />
              <TimeCalendar
                refx="Start Time"
                :on="startTime"
                :data="event.start_time"
                @cTimeOff="(data) => startTime = data"
                @cTime="(data) => event.start_time = data"
              />
              <TimeCalendar
                refx="End Time"
                :on="endTime"
                :data="event.end_time"
                @cTimeOff="(data) => startTime = data"
                @cTime="(data) => event.end_time = data"
              />
              <v-btn
                type="submit"
                color="primary"
                class="mr-4 mt-4"
                @click.stop="selectedOpen = false"
              >create event</v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>
import AnimeCalendar from "@/components/modules/AnimeCalendar";
import DayCalendar from "@/components/modules/DayCalendar";
import TimeCalendar from "@/components/modules/TimeCalendar";
import {
  getCalendar,
  createCalendar,
  updateCalendar,
  removeCalendar
} from "@/services/Options";
import { mapState } from "vuex";
const weekdaysDefault = [0, 1, 2, 3, 4, 5, 6];
export default {
  computed: {
    ...mapState(["animes"])
  },
  asyncData({ store, error }) {
    var headers = {
      "X-User-Session": store.state.auth.userToken
    };
    return getCalendar(headers).then(resp => {
      var { data } = resp.data;
      var { calendars } = data;
      return {
        headers,
        calendars
      };
    });
  },
  data() {
    return {
      dialog: false,
      type: "week",
      startTime: false,
      endTime: false,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      animeData: [],
      event: {},
      events: []
    };
  },
  components: {
    DayCalendar,
    TimeCalendar,
    AnimeCalendar
  },
  mounted() {
    this.animeData = this.animes;
    if (this.calendars) {
      var events = this.calendars;
      for (var event of events) {
        if (!event.start_time || !event.end_time) continue;
        var startArray = this.getDayofMonth(event.day, event.start_time);
        var endArray = this.getDayofMonth(event.day, event.end_time);
        var anime_id = event.anime;
        var anime = this.animeData.filter(x => x.anime_id === anime_id)[0];
        var name = anime.title;
        for (var i = 0; i < startArray.length; i++) {
          var start = startArray[i];
          var end = endArray[i];
          event.name = name;
          this.events.push({ name, start, end, event });
        }
      }
    }
  },
  methods: {
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event.event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    validDate(DATE) {
      if (typeof DATE !== "number" || DATE > 6 || DATE < 0) {
        return false;
      } else {
        return true;
      }
    },
    async addEvent() {
      var event = this.event;
      if (!event.start_time || !event.anime || !event.end_time) {
        return this.$store.commit("snackbar/snackBar", {
          active: true,
          message: { success: false, error: "Missing field." }
        });
      }

      if (!this.validDate(event.day)) {
        return this.$store.commit("snackbar/snackBar", {
          active: true,
          message: { success: false, error: "Day not valid" }
        });
      }
      var response = await createCalendar(this.headers, event);
      if (response.data.success) {
        var { calendar } = response.data;
        var startArray = this.getDayofMonth(event.day, event.start_time);
        var endArray = this.getDayofMonth(event.day, event.end_time);
        var anime_id = event.anime;
        var anime = this.animeData.filter(x => x.anime_id === anime_id)[0];
        var name = anime.title;
        event.id = calendar.id;
        event.name = name;
        for (var i = 0; i < startArray.length; i++) {
          var start = startArray[i];
          var end = endArray[i];
          this.events.push({ name, start, end, event });
        }
      }

      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
    },
    async updateEvent() {
      var events = this.events;
      var event = this.selectedEvent;
      if (!event.id || !event.start_time || !event.anime || !event.end_time) {
        return this.$store.commit("snackbar/snackBar", {
          active: true,
          message: { success: false, error: "Missing field." }
        });
      }

      if (!this.validDate(event.day)) {
        return this.$store.commit("snackbar/snackBar", {
          active: true,
          message: { success: false, error: "Day not valid" }
        });
      }

      var response = await updateCalendar(this.headers, event);
      if (response.data.success) {
        var startArray = this.getDayofMonth(event.day, event.start_time);
        var endArray = this.getDayofMonth(event.day, event.end_time);
        var anime_id = event.anime;
        var anime = this.animeData.filter(x => x.anime_id === anime_id)[0];
        var name = anime.title;
        var newEvents = events.filter(x => x.name !== event.name);
        this.events = newEvents;
        for (var i = 0; i < startArray.length; i++) {
          var start = startArray[i];
          var end = endArray[i];
          this.events.push({ name, start, end, event });
        }
      }

      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
    },
    async removeEvent() {
      var events = this.events;
      var event = this.selectedEvent;
      if (!event.id) {
        return this.$store.commit("snackbar/snackBar", {
          active: true,
          message: { success: false, error: "Missing field." }
        });
      }

      var response = await removeCalendar(this.headers, event);
      if (response.data.success) {
        var newEvents = events.filter(x => x.name !== event.name);
        this.events = newEvents;
        this.selectedOpen = false;
      }

      this.$store.commit("snackbar/snackBar", {
        active: true,
        message: response.data
      });
    },
    getDayofMonth(DAY, TIME) {
      var d = new Date(),
        month = d.getMonth(),
        array = [];

      d.setDate(1);

      // Get the first Monday in the month
      while (d.getDay() !== DAY) {
        d.setDate(d.getDate() + DAY);
      }

      // Get all the other Mondays in the month
      while (d.getMonth() === month) {
        array.push(this.formatDate(new Date(d.getTime())) + ` ${TIME}`);
        d.setDate(d.getDate() + 7);
      }
      return array;
    },
    formatDate(time) {
      return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
    }
  }
};
</script>
<style scoped>
.controls {
  position: relative;
}
</style>

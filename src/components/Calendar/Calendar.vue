<template>
  <v-container>
    <!-- AQUI INICIA EL FORMULARIO PARA CREAR EL EVENTO -->
    <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col md="3">
        <v-menu
              v-model="menuDate"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Dia"
                  prepend-icon="mdi-calendar"
                  readonly
                  :rules="dayRules"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                @input="setToday"
              ></v-date-picker>
            </v-menu>
      </v-col>

      <v-col md="3"
      >
        <v-menu
          ref="menuStart"
          v-model="menuTimeStart"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="timeStart"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="timeStart"
              label="Hora de Inicio"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
              required
              :rules="timeStartRules"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menuTimeStart"
            v-model="timeStart"
            full-width
            @click:minute="$refs.menuStart.save(timeStart)"
          ></v-time-picker>
        </v-menu>
      </v-col>


      <v-col md="3"
      >
        <v-menu
          ref="menuEnd"
          v-model="menuTimeEnd"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="timeEnd"
          transition="scale-transition"
          offset-y
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="timeEnd"
              label="Hora de Final"
              :rules="timeEndRules"
              prepend-icon="mdi-clock-time-four-outline"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-time-picker
            v-if="menuTimeEnd"
            v-model="timeEnd"
            full-width
            @click:minute="$refs.menuEnd.save(timeEnd)|$refs.form.validate()"
          ></v-time-picker>
        </v-menu>
      </v-col>

      <v-col md="3"
      >
          <v-btn
          color="success"
          :disabled="!valid"
          @click="createEventForm"
        >
          Guardar
        </v-btn>
      </v-col>
    </v-row>
    </v-form>

    <!-- AQUI INICIA EL CALENDARIO -->
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-sheet>
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            type="day"
            :events="events"
            :event-color="getEventColor"
            :event-ripple="false"
            @change="fetchEvents"
          >
        </v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./Calendar"></script>

import { db } from '../../main'
import { getDocs, collection, query, addDoc, onSnapshot } from 'firebase/firestore'

export default {
    data: () => ({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menuDate: false,
      timeStart: null,
      timeEnd: null,
      menuTimeStart: false,
      menuTimeEnd: false,
      createEvent: null,
      focus: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      valid: true,
      // timeStartRules: [
      //   v => !!v || 'Hora Inicio Obligatoria',
      // ],
    }),

    computed: {
      dayRules () {

        const dayRules = []

        let rule;

        let dateFromString = this.date.split("-");

        const dateStart = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2] );

        const dateToday = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);

        rule = 
        v => Date.parse(dateToday) < Date.parse(dateStart) || 'El dia escogido es invalido'

        dayRules.push(rule);

        return dayRules;
      },
      timeStartRules () {
        const timeStartRules = []

        let noColision = true;

        let rule;

          rule =
          v => !!v || 'Hora Inicio Obligatoria'

          timeStartRules.push(rule)
        
        if (this.timeStart != null) {

          let dateFromString = this.date.split("-");

          let timeStartFromString = this.timeStart.split(":");

          const dateStart = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeStartFromString[0], timeStartFromString[1], "00")

          rule =
              v => Date.parse(new Date()) < Date.parse(dateStart) || 'Hora inicio menor que Hora Actual'

              timeStartRules.push(rule)

          if (this.timeEnd != null) {

            let timeEndFromString = this.timeEnd.split(":");

            
            const dateEnd = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeEndFromString[0], timeEndFromString[1], "00" )

            rule =
              v => Date.parse(dateEnd) > Date.parse(dateStart) || 'Hora inicio mayor que Hora Final'

              timeStartRules.push(rule)


            rule =
              v => Date.parse(dateEnd) != Date.parse(dateStart) || 'Hora inicio Igual que Hora Final'

              timeStartRules.push(rule)

            for (let i = 0; i < this.events.length; i++) {
              const element = this.events[i];
              if ((element.start > Date.parse(dateStart) && element.start < Date.parse(dateEnd)) || (element.end > Date.parse(dateStart) && element.end < Date.parse(dateEnd))) {
                noColision = false
              } else if ((element.start < Date.parse(dateStart) && element.start > Date.parse(dateEnd)) || (element.end < Date.parse(dateStart) && element.end > Date.parse(dateEnd))
                            || (element.start == Date.parse(dateStart) && element.end == Date.parse(dateEnd))) {
                noColision = false
              }
            }

            rule =
              v => noColision || 'Tiempo Reservado'

              timeStartRules.push(rule)
          }
        }

        return timeStartRules
      },

      timeEndRules () {
        const timeEndRules = []

        let noColision = true;

        let rule;

          rule =
          v => !!v || 'Hora Final Obligatoria'

          timeEndRules.push(rule)
        

        if (this.timeEnd != null && this.timeStart != null) {

          let dateFromString = this.date.split("-");

          let timeStartFromString = this.timeStart.split(":");

          let timeEndFromString = this.timeEnd.split(":");

          const dateStart = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeStartFromString[0], timeStartFromString[1], "00")
          const dateEnd = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeEndFromString[0], timeEndFromString[1], "00" )

          rule =
            v => Date.parse(dateEnd) > Date.parse(dateStart) || 'Hora Final menor que Fecha inicio'

            timeEndRules.push(rule)


          rule =
            v => Date.parse(dateEnd) != Date.parse(dateStart) || 'Hora Final Igual que Fecha inicio'

            timeEndRules.push(rule)

          for (let i = 0; i < this.events.length; i++) {
            const element = this.events[i];
            if ((element.start > Date.parse(dateStart) && element.start < Date.parse(dateEnd)) || (element.end > Date.parse(dateStart) && element.end < Date.parse(dateEnd))) {
              noColision = false
            } else if ((element.start < Date.parse(dateStart) && element.start > Date.parse(dateEnd)) || (element.end < Date.parse(dateStart) && element.end > Date.parse(dateEnd))
                        || (element.start == Date.parse(dateStart) && element.end == Date.parse(dateEnd))) {
                noColision = false
            }
          }

          rule =
            v => noColision || 'Tiempo Reservado'

            timeEndRules.push(rule)
        }

        return timeEndRules
      },
    },

    methods: {
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.date
        this.menuDate = false
      },
      async createEventForm () {

        await this.$refs.form.validate()

        if (this.valid) {

          const collectionRef = collection( db, 'events'); 

          let dateFromString = this.date.split("-");

          let timeStartFromString = this.timeStart.split(":");

          let timeEndFromString = this.timeEnd.split(":");

          const dateStart = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeStartFromString[0], timeStartFromString[1], "00")
          const dateEnd = new Date( dateFromString[0], dateFromString[1] - 1, dateFromString[2], timeEndFromString[0], timeEndFromString[1], "00" )

          console.log(Date.parse(dateStart));
          console.log(Date.parse(dateEnd));

          this.createEvent = {
            name: 'reserva de kevin',
            color: this.rndElement(this.colors),
            start: Date.parse(dateStart),
            end: Date.parse(dateEnd),
            timed: true,
        }

        await addDoc(collectionRef, this.createEvent)
        }
      },
      async fetchEvents () {

        try {
            
            onSnapshot(collection( db, 'events'), (snap) => {
                this.events = [];

                snap.forEach((doc) => {
                    this.events.push(doc.data());
                })
            });

        } catch (error) {
            console.log(error);
        }
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      rndElement (arr) {
        return arr[this.rnd(0, arr.length - 1)]
      },
    },
  }
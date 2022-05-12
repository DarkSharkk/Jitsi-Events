<template>
  <div class="hello" id="wrapper">
    <div class="content">
    <b-row align-h="between" class="justify-content-md-center" style="width: 100%; margin: 0px">
      <b-col class="col-md-8 col-xl-8 col-sm-12">
        <div class="container" style="padding: 0rem">

<!--          Заголовок страницы-->
          <b-row align-h="center" class="" style="margin-top: 2rem">
            <h1>Мои события</h1>
          </b-row>

<!--          Таблица событий-->
          <b-overlay :show="flag_loading">
            <b-table striped hover :fields="fields" :items="entities" v-if="events_is_loaded"
                     style="width: 100%; overflow-wrap: break-word;" stacked="md">
              <template #cell(title)="data">
                <b-link :to="{name: 'event-info', params: {event_id: data.item.entity_id}}">
                  {{ data.item.title }}
                </b-link>
              </template>
              <template #cell(starts_at)="data">
                {{ data.item.starts_at | fmtDateTime }}
              </template>
              <template #cell(ends_at)="data">
                {{ data.item.ends_at | fmtDateTime }}
              </template>
              <template #cell(created_by)="data">
                {{ data.item.created_by }}
              </template>
            </b-table>
            <p v-else>{{ data_message }}</p>
          </b-overlay>

<!--          Модальное окно для добавления событий-->
          <div style="display: flex; justify-content: center">
            <b-button v-b-modal.modal-event> Добавить событие </b-button>
            <div v-if="!events_is_loaded" style=""></div>
            <b-modal id="modal-event" button-size="sm" scrollable centered
                      hide-header-close ok-title="Закрыть">
              <template #modal-header="{ close }">
                <h5>Добавление событий</h5>
                <b-button size="sm" variant="danger" @click="close()">
                  X
                </b-button>
              </template>
              <b-form>
                <b-form-group>
                  <label class="mr-sm-2" label-for="event-name">Название события:</label>
                  <b-form-input placeholder="Введите название события"
                                v-model="form.title" id="event-name"
                                :state="validation_title" required></b-form-input>
                  <b-form-invalid-feedback :state="validation_title">
                    Длина имени от 2 до 30 символов. Допустимы только символы латинского алфавита и цифры.
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group>
                  <label class="mr-sm-2" label-for="event-start">Время начала:</label>
                  <date-picker id="datepicker-start" style="padding: 0"
                               v-model="form.starts_at" type="datetime"
                               placeholder="Выберите время начала" value-type="timestamp"
                               class="form-control" :state="validation_start"></date-picker>
                </b-form-group>
                <b-form-group>
                  <label class="mr-sm-2" label-for="event-start">Время начала:</label>
                  <date-picker id="datepicker-start" style="padding: 0"
                               v-model="form.ends_at" type="datetime"
                               placeholder="Выберите время окончания" value-type="timestamp"
                               class="form-control" :state="validation_end"></date-picker>
                </b-form-group>

                <b-button size="sm" variant="primary" style="margin-left: 40%; margin-top: 0.5rem"
                          :disabled="!validation_title || !validation_start || !validation_end"
                          v-on:click="createEvent()">
                  Создать
                </b-button>
              </b-form>

            </b-modal>
          </div>

        </div>
      </b-col>
    </b-row>
    </div>

  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru';

export default {
  components: {DatePicker},
  name: 'HelloWorld',
  data() {
    return {
      fields: [
        {key: "title", label: "Название"},
        {key: "starts_at", label: "Начало"},
        {key: "ends_at", label: "Конец"},
        {key: "created_by", label: "Организатор"}
      ],
      entities: [{
        "entity_id": 0,
        "scope": "event",
        "title": "string",
        "link": "string",
        "platform": "string",
        "starts_at": "2022-03-20T09:28:08.197Z",
        "ends_at": "2022-03-20T09:28:08.197Z",
        "created_by": "iiivanov@edu.hse.ru",
      }],
      flag_loading: true,
      events_is_loaded: false,
      data_message: "",
      email: "",
      scope: "event",
      form: {
        scope: "event",
        title: "My-Awesome-Event",
        platform: "string",
        starts_at: "",
        ends_at: "",
        created_by: "askonstantinov@edu.hse.ru",
        part_of: null,
        min_permissions: 0,
      },
      errorMessage: '',
      entity_id: 0,
      // domain: 'meet.miem.hse',
      // options: {
      //   roomName: 'JitsiMeetAPIExample',
      //   width: 700,
      //   height: 700,
      //   parentNode: document.querySelector('#meet'),
      //   lang: 'de',
      // },
    }
  },
  computed: {
    validation_title() {
      let format = /[^a-zA-Z0-9\-_ ]/
      if (this.form.title.length < 2 || this.form.title.length > 30) return false;

      if (format.test(this.form.title)) {
        return false;
      } else
        return true;
    },
    validation_start() {
      if (!this.form.starts_at) return false;
      return true;
    },
    validation_end() {
      if (!this.form.ends_at) return false;
      return true;
    }
  },
  filters: {
    fmtDateTime: d => (new Date(d)).toLocaleString(
      'ru-RU',
      {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }
    ),
  },
  mounted() {

    // let recaptchaScript = document.createElement('script')
    // recaptchaScript.setAttribute('src', 'https://meet.miem.hse.ru/external_api.js')
    // document.head.appendChild(recaptchaScript)
    // const api = new JitsiMeetExternalAPI(this.domain, this.options);
    // alert(api.getParticipantsInfo())

    // For dev
    this.events_is_loaded = true;
    this.flag_loading = false;
    // let scope = this.scope;
    // this.api_get_user_events(scope);
  },
  methods: {
    api_get_user_events(scope) {
      this.flag_loading = true;
      this.events_is_loaded = false;
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/entity/list/brief/', {
            scope: scope,
          }, {withCredentials: true})
          .then(response => {
            if (response.data) {
              this.events_is_loaded = true;
              this.flag_loading = false;

              this.entities = response.data.entities;
            } else {
              this.events_is_loaded = false;
              this.data_message = "События отсутствуют";
              this.flag_loading = false;
            }
          })
          .catch((error) => {
            this.events_is_loaded = false;
            this.data_message = "События отсутствуют";
            this.flag_loading = false;
            console.log(error);
          });
    },
    add_created_event(scope) {
      this.api_get_user_events(scope);
    },
    createEvent() {
      let scope = this.form.scope;
      let title = this.form.title;
      let platform = this.form.platform
      let starts_at = this.form.starts_at
      let ends_at = this.form.ends_at
      let created_by = this.form.created_by
      let part_of = this.form.part_of
      let min_permissions = this.form.min_permissions

      this.api_create_event(scope, title, platform, starts_at, ends_at, created_by, part_of, min_permissions);
      this.$bvModal.hide('modal-event');
    },
    api_create_event(scope, title, platform, starts_at, ends_at, created_by, part_of, min_permissions) {
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/entity/', {
            scope: scope,
            title: title,
            platform: platform,
            starts_at: starts_at,
            ends_at: ends_at,
            created_by: created_by,
            min_permissions: min_permissions
          }, {withCredentials: true})
          .then(response => {
            if (response.data) {
              this.add_created_event(response.data.scope);
              this.errorMessage = '';
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status == 401) {
                this.errorMessage = "Требуется авторизация";
              }
              if (error.response.status == 400) {
                this.errorMessage = "Ошибка в запросе";
              } else {
                this.errorMessage = "Не удалось добавить событие";
              }
              console.log(error.response.data);
              console.log(error.response.status);
            }
          })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: blue;
}
b-link {
  color: blue;
  text-decoration: none;
  font-weight: bold;
}
</style>

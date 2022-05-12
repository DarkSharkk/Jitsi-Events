<template>
  <div id="event-info" class="wrapper">
    <div class="content">
    <b-row align-h="between" class="justify-content-md-center" style="width: 100%; margin-top: 20px">
      <b-col class="" style="width: 100%; padding: 0px; margin-left: 1.3rem">

        <b-row align-h="center" class="" style="margin-top: 1.8rem">
          <h1>Информация о событии</h1>
        </b-row>

<!--          Информация о событии-->
          <b-overlay :show="flag_loading">
<!--            <div v-if="event_is_loaded">-->
            <b-tabs class="col-lg-6 col-xl-6 col-md-6 col-sm-12" v-if="event_is_loaded" active-nav-item-class="info-tab-link"
                    style="margin-left: auto; margin-right: auto">
              <b-tab title="Событие" active style="margin-left: 2%">
                <b-row align-h="center" class="justify-content-md-center"
                       style="width: 100%; margin: 0px; overflow-wrap: break-word;">
                  <b-col align-h="center"
                         style="text-align: center; margin-top: 0.5rem"><h2>{{event_title}}</h2></b-col>
                </b-row>

                <b-row align-h="center" class="justify-content-md-center"
                       style="width: 100%; margin: 0px; overflow-wrap: break-word;">
                  <b-col cols="6" style="text-align: right; font-weight: bold"><p>Время начала: </p></b-col>
                  <b-col cols="6" style="text-align: left"><p>{{ event_starts_at | fmtDateTime }}</p></b-col>
                </b-row>

                <b-row align-h="center" class="justify-content-md-center"
                       style="width: 100%; margin: 0px; overflow-wrap: break-word;">
                  <b-col cols="6" style="text-align: right; font-weight: bold"><p>Время окончания: </p></b-col>
                  <b-col cols="6" style="text-align: left"><p>{{ event_ends_at | fmtDateTime }}</p></b-col>
                </b-row>

                <b-row align-h="center" class="justify-content-md-center"
                       style="width: 100%; margin: 0px; overflow-wrap: break-word;">
                  <b-col cols="6" style="text-align: right; font-weight: bold"><p>Создано: </p></b-col>
                  <b-col cols="6" style="text-align: left"><p>{{event_created_by.email_hse}}</p></b-col>
                </b-row>

                <b-row align-h="center" class="justify-content-md-center"
                       style="width: 100%; margin: 0px; overflow-wrap: break-word;">
                  <b-col cols="6" style="text-align: right; font-weight: bold">Главная: </b-col>
                  <b-col cols="6" style="text-align: left">
                    <p><b-link :href="event_link" target="_blank">Присоединиться</b-link></p>
                  </b-col>
                </b-row>

<!--                Приглашения-->
                <b-button v-b-modal.modal-invite> Пригласить </b-button>
                <b-modal id="modal-invite"
                         button-size="sm" scrollable centered ok-only
                         hide-header-close ok-title="Закрыть">
                  <template #modal-header="{ close }">
                    <h5>Добавление событий</h5>
                    <b-button size="sm" variant="danger" @click="close()">
                      X
                    </b-button>
                  </template>
                  <b-form>
                    <b-form-group>
                      <label class="mr-sm-2" label-for="invite-email">Электронная почта:</label>
                      <b-form-input placeholder="Введите почту"
                                    v-model="invite_form.email" id="invite-email"
                                    type="email" required></b-form-input>
                    </b-form-group>
                    <b-form-group>
                      <b-input-group prepend="Роль:" style="margin-top: 0.3rem">
                        <b-form-select v-model="invite_form.role" id="invite-role" :options="roles" required>
                        </b-form-select>
                      </b-input-group>
                    </b-form-group>
                    <b-form-group>
                      <b-form-checkbox id="zulip_message" v-model="invite_form.zulip" name="zulip_message"
                                       style="margin-top: 0.3rem" value="true"
                                       unchecked-value="false">Уведомить о приглашении в Zulip
                      </b-form-checkbox>
                    </b-form-group>

                    <b-button size="sm" variant="primary" style="margin-top: 0.3rem; margin-left: 40%"
                              :disabled="!validation_email || !validation_role"
                              v-on:click="inviteUser()"> Пригласить </b-button>
                  </b-form>
                </b-modal>

<!--                Список приглашенных пользователей-->
                <h4 style="margin-top: 1.2rem">Приглашённые пользователи</h4>
                <b-overlay :show="flag_loading">
                  <b-table striped hover :fields="acl_fields" :items="acl" v-if="event_is_loaded"
                           style="width: 100%; overflow-wrap: break-word;" stacked="md">
                    <template #cell(email_hse)="data">
                      {{ data.item.account.email_hse }}
                    </template>
                    <template #cell(display_name)="data">
                      {{ data.item.account.display_name }}
                    </template>
                    <template #cell(student_usertype_name)="data">
                      <b-button v-on:click="notify_user(data.item.account.email_hse, 'zulip')"
                                variant="primary">Напомнить</b-button>
                    </template>
                  </b-table>
                </b-overlay>

              </b-tab>


              <b-tab title="Комнаты">
                <b-overlay :show="flag_loading">
                <b-table striped hover :fields="fields" :items="children" v-if="event_is_loaded"
                         style="width: 100%; overflow-wrap: break-word;" stacked="md">
                  <template #cell(event_title)="data">
                    <b-a v-b-modal.modal-1>{{ data.item.title }}</b-a>
                  </template>
                  <template #cell(event_starts_at)="data">
                    {{ data.item.starts_at | fmtDateTime }}
                  </template>
                  <template #cell(event_ends_at)="data">
                    {{ data.item.ends_at | fmtDateTime }}
                  </template>
                  <template #cell(created_by)="data">
                    <b-link :href="data.item.link" target="_blank">Присоединиться</b-link>
                  </template>
                </b-table>
                  <p v-else>Комнаты отсутствуют</p>
                </b-overlay>

                <b-modal id="modal-1" title="Информация по участникам комнаты">

                </b-modal>
<!--                Добавление комнат-->
                <b-button v-b-modal.modal-add-room
                          style="margin-top: 10px"> Добавить </b-button>
                <b-modal id="modal-add-room"
                         button-size="sm" scrollable centered ok-only
                         hide-header-close ok-title="Закрыть">
                  <template #modal-header="{ close }">
                    <h5>Добавление событий</h5>
                    <b-button size="sm" variant="danger" @click="close()">
                      X
                    </b-button>
                  </template>
                  <b-form>
                    <b-form-group>
                      <label class="mr-sm-2" label-for="event-name">Название команаты:</label>
                      <b-form-input placeholder="Введите название комнаты"
                                    v-model="room_form.title" id="event-name"
                                    :state="validation_title" required></b-form-input>
                      <b-form-invalid-feedback :state="validation_title">
                        Длина имени от 2 до 30 символов. Допустимы только символы латинского алфавита и цифры.
                      </b-form-invalid-feedback>
                    </b-form-group>
                    <b-form-group>
                      <label class="mr-sm-2" label-for="event-start">Время начала:</label>
                      <date-picker id="datepicker-start" style="padding: 0"
                                   v-model="room_form.starts_at" type="datetime"
                                   placeholder="Выберите время начала" value-type="timestamp"
                                   class="form-control" :state="validation_start"></date-picker>
                    </b-form-group>
                    <b-form-group>
                      <label class="mr-sm-2" label-for="event-start">Время начала:</label>
                      <date-picker id="datepicker-start" style="padding: 0"
                                   v-model="room_form.ends_at" type="datetime"
                                   placeholder="Выберите время окончания" value-type="timestamp"
                                   class="form-control" :state="validation_end"></date-picker>
                    </b-form-group>

                    <b-button size="sm" variant="primary" style="margin-top: 0.3rem; margin-left: 40%"
                              :disabled="!validation_title || !validation_start || !validation_end"
                              v-on:click="createRoom()">
                      Создать
                    </b-button>
                  </b-form>
                </b-modal>

              </b-tab>
            </b-tabs>
<!--            </div>-->
            <p v-else>{{ data_message }}</p>
          </b-overlay>
      </b-col>
    </b-row>
    </div>

<!--    <div ref="jitsiContainer" style="height: 100%; width: 100%;"></div>-->
  </div>
</template>

<script>
import DatePicker from "vue2-datepicker";

export default {
  props: {
    event_id: {
      type: Number,
      default: null
    },
    domain: {
      type: String,
      default: 'meet.jit.si'
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {DatePicker},
  name: 'EventInfo',
  data() {
    return {
      invite_form: {
        email: '',
        role: '',
        zulip: 'true'
      },
      toastCount: 0,
      roles: [{text: 'Гость', value: 1}],
      flag_loading: true,
      event_is_loaded: false,
      event_title: 'event_title',
      event_starts_at: 'event_starts_at',
      event_ends_at: 'event_ends_at',
      event_created_by: {
        email_hse: 'email_hse'
      },
      event_link: 'https://meet.miem.hse.ru/nvt-33',
      children: [
        {
          title: 'event_title',
          starts_at: 'event_starts_at',
          ends_at: 'event_ends_at',
          created_by: {
            email_hse: 'email_hse'
          },
        },
        {
          title: 'event_title',
          starts_at: 'event_starts_at',
          ends_at: 'event_ends_at',
          created_by: {
            email_hse: 'email_hse'
          },
        }
      ],
      data_message: 'data_message',
      fields: [
        {key: 'event_title', label: 'Название'},
        {key: 'event_starts_at', label: 'Начало'},
        {key: 'event_ends_at', label: 'Конец'},
        {key: 'created_by', label: ''},
      ],
      entity_id: 0,
      errorMessage: '',
      acl: [
        {
          "entity_id": 0,
          "account": {
            "email_google": "iiivanov@miem.hse.ru",
            "email_hse": "iiivanov@edu.hse.ru",
            "student_usertype_name": "Учащийся",
            "student_cource_name": "Бакалавриат 3 курс",
            "student_group_name": "БИВ191",
            "display_name": "Иванов Иван Иванович",
            "last_login": "2022-03-13T10:41:26.530Z"
          },
          "level": 0
        }
      ],
      acl_fields: [
        {key: 'account.email_hse', label: 'Почта'},
        {key: 'account.display_name', label: 'Имя'},
        {key: 'student_usertype_name', label: ''}
      ],
      zulip_message: '',
      room_form: {
        scope: "room",
        title: "My-Fabulous-Room",
        platform: "string",
        starts_at: "",
        ends_at: "",
        created_by: "user@edu.hse.ru",
        part_of: "",
        min_permissions: 0,
      },
    }
  },
  computed: {
    validation_email() {
      if (this.invite_form.email.length == 0 || !this.invite_form.email.includes('@')) return false;
      return true;
    },
    validation_role() {
      if (this.invite_form.role.length == 0) return false;
      return true;
    },
    validation_title() {
      let format = /[^a-zA-Z0-9\-_ ]/
      if (this.room_form.title.length < 2 || this.room_form.title.length > 30) return false;

      if (format.test(this.room_form.title)) {
        return false;
      } else
        return true;
    },
    validation_start() {
      if (!this.room_form.starts_at) return false;
      return true;
    },
    validation_end() {
      if (!this.room_form.ends_at) return false;
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

    // let l_event_id = this.event_id;
    // if (!l_event_id) {
    //   l_event_id = this.$route.params.event_id;
    // }
    // this.api_get_event_info(l_event_id);
    // this.api_get_event_users(l_event_id);

    // For dev
    this.event_is_loaded = true;
    this.flag_loading = false;

    // this.loadScript('https://meet.jit.si/external_api.js', () => {
    //   if (!window.JitsiMeetExternalAPI) throw new Error('Jitsi Meet API not loaded');
    //   this.embedJitsiWidget();
    // });
    // console.log(this.jitsiApi.getParticipantsInfo());
  },
  beforeDestroy () {
    this.removeJitsiWidget();
  },
  methods: {
    loadScript (src, cb) {
      const scriptEl = document.createElement('script');
      scriptEl.src = src;
      scriptEl.async = 1;
      document.querySelector('head').appendChild(scriptEl);
      scriptEl.addEventListener('load', cb);
    },
    embedJitsiWidget () {
      const options = {
        ...this.options,
        parentNode: this.$refs.jitsiContainer,
        roomName: 'nvt-3',
      };
      this.jitsiApi = new window.JitsiMeetExternalAPI(this.domain, options);
    },
    executeCommand (command, ...value) {
      this.jitsiApi.executeCommand(command, ...value);
    },
    addEventListener (event, fn) {
      this.jitsiApi.on(event, fn);
    },
    // Misc
    removeJitsiWidget () {
      if (this.jitsiApi) this.jitsiApi.dispose();
    },
    api_get_event_info(event_id) {
      this.axios
        .get('https://events.konstant-anxiety.ru/api/v1/entity/' + event_id, {withCredentials: true})
        .then(response => {
          if (response.data) {
            this.event_title = response.data.title;
            this.event_starts_at = response.data.starts_at;
            this.event_ends_at = response.data.ends_at;
            this.event_created_by.email_hse = response.data.created_by.email_hse;
            this.children = response.data.children;
            this.entity_id = response.data.entity_id;
            this.event_link = "https://" + response.data.link;

            for (let i = 0; i < this.children.length; i++) {
                this.children[i].link = "https://" + this.children[i].link;
            }

            this.event_is_loaded = true;
            this.flag_loading = false;
          } else {
            this.data_message = 'Информация по событию отсутствует';
            this.event_is_loaded = true;
            this.flag_loading = false;
          }
        })
        .catch((error) => {
          this.event_is_loaded = false;
          this.data_message = 'Информация по событию отсутствует';
          this.flag_loading = false;
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
          }
        })
      console.log(event_id)
    },
    // Получение списка участников события
    api_get_event_users(entity_id) {
      this.axios
        .get('https://events.konstant-anxiety.ru/api/v1/entity/' + entity_id + '/acl/', {withCredentials:true})
          .then(response => {
            if (response.data) {
              this.event_is_loaded = true;
              this.flag_loading = false;

              this.acl = response.data.acl;
              this.errorMessage = '';
            } else {
              this.event_is_loaded = false;
              this.errorMessage = 'Участников пока нет';
              this.flag_loading = false;
            }
          })
          .catch((error) => {
            this.event_is_loaded = false;
            this.errorMessage = 'Участников пока нет';
            this.flag_loading = false;
            console.log(error);
          })
      console.log(entity_id)
    },
    add_invited_user(entity_id) {
      this.api_get_event_users(entity_id);
    },
    inviteUser() {
      let entity_id = this.$route.params.event_id;
      let account = this.invite_form.email;
      let level = this.invite_form.role;

      let zulip = this.invite_form.zulip;

      this.api_invite_user(entity_id, account, level);

      if (zulip == 'true') {
        this.api_notify_user(entity_id, account, 'zulip')
      }

      this.$bvModal.hide('modal-invite');
    },
    notify_user(email_hse, channel) {

      this.api_notify_user(Number(this.$route.params.event_id), email_hse, channel);

    },
    makeToast(variant = null) {
      this.$bvToast.toast('Toast body content', {
        title: `Variant ${variant || 'default'}`,
        variant: variant,
        solid: true,
        noCloseButton: true,
      })
    },
    api_notify_user(entity_id, email_hse, channel) {
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/notify', {
            entity_id: entity_id,
            email_hse: email_hse,
            channel: channel
          }, {withCredentials: true})
          .then(response => {
            if (response.data) {
              this.zulip_message = 'Уведомление отправлено';
              alert(this.zulip_message);
              console.log(this.zulip_message);
            }
          })
          .catch((error) => {
            this.zulip_message = 'Ошибка отправки уведомления';
            console.log(this.zulip_message);

            console.log(error.response.data);
            console.log(error.response.status);

          })
    },
    api_invite_user(entity_id, account, level) {
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/acl/', {
            entity_id: entity_id,
            account: account,
            level: 100
          }, {withCredentials: true})
          .then(response => {
            if (response.data) {
              this.add_invited_user(response.data.entity_id);
              this.errorMessage = '';
              console.log(level);
            }
          })
          .catch((error) => {
            if (error.response) {
              if (error.response.status == 401) {
                this.errorMessage = "Требуется авторизация";
              }
              if (error.response.status == 400) {
                this.errorMessage = "Ошибка в авторизации";
              } else {
                this.errorMessage = "Не удалось добавить событие";
              }
              console.log(error.response.data);
              console.log(error.response.status);
            }
          })
    },
    add_created_room(event_id) {
      this.api_get_event_info(event_id);
    },
    createRoom() {
      let scope = this.room_form.scope;
      let title = this.room_form.title;
      let platform = this.room_form.platform;
      let starts_at = this.room_form.starts_at;
      let ends_at = this.room_form.ends_at;
      let created_by = this.room_form.created_by;
      let part_of = this.$route.params.event_id;
      let min_permissions = this.room_form.min_permissions;

      this.api_create_room(scope, title, platform, starts_at, ends_at, created_by, part_of, min_permissions);

      this.$bvModal.hide('modal-add-room');
    },
    api_create_room(scope, title, platform, starts_at, ends_at, created_by, part_of, min_permissions) {
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/entity/', {
            scope: scope,
            title: title,
            platform: platform,
            starts_at: starts_at,
            ends_at: ends_at,
            created_by: created_by,
            part_of: part_of,
            min_permissions: min_permissions
          }, {withCredentials: true})
          .then(response => {
            if (response.data) {
              this.add_created_room(this.$route.params.event_id);
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
    }
  }
}
</script>

<style>
</style>

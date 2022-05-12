<template>
  <div id="app" class="wrapper">
    <div class="content">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-navbar-brand>
        <b-link to="/" style="text-decoration: none">Jitsi Events</b-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-nav-item>
              <b-link to="/">Мои события</b-link>
            </b-nav-item>
            <b-nav-item>
              <b-link to="/search">Поиск событий</b-link>
            </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto" style="margin-left: auto">
          <b-nav-item v-if="is_auth_flag" style="pointer-events: none">{{ this.login }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>

    </b-navbar>

    <router-view/>
    </div>

      <footer id="foot" class="d-flex flex-wrap justify-content-between align-items-center border-top">
        <div class="col-lg-6 col-xl-6 col-md-6 col-sm-12 container" style="margin-left: auto; margin-right: auto">
          <b-row>

            <b-col sm="5" md="4" xl="4" lg="4">
              <div class="text-muted" >
                <a class="footer-link"
                   href="https://chat.miem.hse.ru/#narrow/stream/2041-.D0.A1.D0.92.D0.A2-3-Jitsi.20Events/topic/.D0.9F.D0.BE.D0.B4.D0.B4.D0.B5.D1.80.D0.B6.D0.BA.D0.B0"
                   target="_blank">
                  Техническая поддержка &nbsp;
                </a>
              </div>
            </b-col>

            <b-col sm="5" md="4" xl="4" lg="4">
              <div class="c">
                <span class="text-muted">&copy; 2022 МИЭМ НИУ ВШЭ</span>
              </div>
            </b-col>

            <b-col sm="12" md="4" xl="4" lg="4">
              <div>
                <span v-b-modal.modal-qa><strong style="color: blueviolet">Обратная связь</strong></span>

                <b-modal id="modal-qa" scrollable centered ok-only
                         hide-header-close ok-title="Закрыть">

                  <template #modal-header="{ close }">
                    <h5>Обратная связь</h5>
                    <b-button size="sm" variant="danger" @click="close()">
                      X
                    </b-button>
                  </template>

                  <b-form>
                    <b-form-group>
                      <b-input-group prepend="Тип сообщения:" style="margin-top: 0.3rem">
                        <b-form-select id="message_type" v-model="report_form.type" :options="report_types" required>
                        </b-form-select>
                      </b-input-group>
                    </b-form-group>

                    <b-form-group>
                      <b-form-checkbox id="anon" v-model="report_form.anon" name="anon" style="margin-top: 0.3rem"
                                       value="true" unchecked-value="false">Анонимно
                      </b-form-checkbox>
                    </b-form-group>

                    <b-form-group>
                      <label label-for="report_content">Текст сообщения: </label>
                      <b-form-textarea id="report_content" placeholder="Введите текст"
                                       v-model="report_form.content"></b-form-textarea>
                    </b-form-group>

                    <b-button size="sm" variant="primary" v-on:click="report()"
                              :disabled="!validation_type || !validation_content"
                              style="margin-top: 0.3rem; margin-left: 40%">
                      Отправить
                    </b-button>
                  </b-form>

                </b-modal>
              </div>
            </b-col>
          </b-row>
        </div>
      </footer>
    </div>
</template>

<script>
export default {
  name: 'App',
  components: {

  },
  beforeMount() {
    // this.api_check_auth();
  },
  mounted() {
    // this.api_check_auth();
  },
  data() {
    return {
      is_auth_flag: false,
      login: '5555545444544554544',
      report_form: {
        type: '',
        anon: 'false',
        context: {
          url: ''
        },
        content: ''
      },
      error_message: '',
      report_types: [{text: 'Баг', value: 'bug'}, {text: 'Предложение', value: 'feature'}]
    }
  },
  computed: {
    validation_type() {
      if (this.report_form.type.length == 0) return false;
      return true;
    },
    validation_content() {
      if (this.report_form.content == 0) return false;
      return true;
    }
  },
  methods: {
    set_auth_flag(value) {
      this.is_auth_flag = value;
    },
    api_check_auth() {
      this.axios
          .get('https://events.konstant-anxiety.ru/api/v1/account', {withCredentials: true})
          .then(response => {
            if (response.status == 200) {
              this.set_auth_flag(true);

              this.login = response.data.email_hse;
            } else {
              window.location.href = 'https://profile.miem.hse.ru/auth/realms/MIEM/protocol/openid-connect/auth?response_type=code&client_id=nvt-3-project&redirect_uri=https%3A%2F%2Fevents.konstant-anxiety.ru%2Fauth';
            }
          })
          .catch((error) => {
            if (error.response) {
              this.set_auth_flag(false);
              this.is_auth_flag = false;

              this.login = '';

              console.log(error.response.data);
              console.log(error.response.status);
            }
            window.location.href = 'https://profile.miem.hse.ru/auth/realms/MIEM/protocol/openid-connect/auth?response_type=code&client_id=nvt-3-project&redirect_uri=https%3A%2F%2Fevents.konstant-anxiety.ru%2Fauth';
          })
    },
    report() {
      let type = this.report_form.type;
      let anon = this.report_form.anon;
      let context = {
        url: window.location.href
      };
      let content = this.report_form.content;

      this.api_report(type, anon, context, content);
    },
    api_report(type, anon, context, content) {
      this.axios
          .post('https://events.konstant-anxiety.ru/api/v1/report', {
            type: type,
            anon: anon,
            context: context,
            content: content
          }, {withCredentials: true})
          .then(response => {
            if (response.status == 200) {
              this.error_message = '';
              alert('Форма отправлена!')
            }
          })
          .catch((error) => {
            this.error_message = 'Не удалось отправить предложение!';
            console.log(this.error_message);
            console.log(error.response.data);
            console.log(error.response.status);
          })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: white;
  text-decoration: none;
}

nav a.router-link-exact-active {
  color: white;
  text-decoration: underline 0.2rem;
}

nav a:hover {
  color: white;
  transform: scale(1.05);
}

template {
  min-height: 100%;
}
.wrapper {
  position: relative;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.content {
  min-height: 100%;
  margin-bottom: 30px;
}
#foot {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30px;
}

.footer-link {
  text-decoration: none;
  color: blue;
}

html, body {
  height: 100%;;
}
</style>

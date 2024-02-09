import { boot } from 'quasar/wrappers';
import VueGoogleMaps from '@fawmi/vue-google-maps';

export default boot(({ app }) => {
  app.use(VueGoogleMaps, { // 🤿 Vue App. Please install Vue Google Maps
    load: {
      key: 'AIzaSyAZ3P9XEHmIMU2UAnfj0hCD2V2i6R3aStA', // 🤿 I don't have a google key, so leave it blank for now
    },
  });
});

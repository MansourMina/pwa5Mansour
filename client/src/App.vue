<template>
  <div>
    <button style="right: 0; top: 0" class="bg-green" @click="subscribe()">
      Subscribe
    </button>
    <div
      id="app"
      class="
        container
        d-flex
        flex-column
        justify-content-center
        align-items-center
        mt-5
      "
    >
      <img src="employees.jpg" width="400" class="mb-5" />
      <div
        class="alert alert-danger w-100 text-center"
        role="alert"
        v-if="offline"
      >
        You are offline...
      </div>
      <ButtonGet @get="fetchData"></ButtonGet>
      <CardView :employees="employees" @del="delEmployee"></CardView>
    </div>
  </div>
</template>

<script>
import { openDB } from 'idb';
import ButtonGet from '@/components/ButtonGet.vue';
import CardView from '@/components/CardView.vue';
import axios from 'axios';
export default {
  name: 'app',
  components: {
    ButtonGet,
    CardView,
  },
  data() {
    return {
      employees: [],
      db: null,
      offline: false,
      serverAddress: process.env.VUE_APP_SERVER,
      publicVapidKey:
        'BIpryJcbo_NkKKZklxFKKdjF1oceyeHcriZf7GiAFkzhJKYn9E-kEB7HiCtfwP6zva58qEULcgAtaPDaf88tEXE',
    };
  },
  async created() {
    await this.setIndexDB();
    document.addEventListener('swUpdated', this.updateAvailable, {
      once: true,
    });

    window.addEventListener('online', () => {
      this.offline = false;
    });
    window.addEventListener('offline', () => {
      this.employees = this.employees.filter((el) => !el.isDeleted);
      this.offline = true;
    });
    if (navigator.onLine) {
      this.offline = false;
    } else {
      this.employees = this.employees.filter((el) => !el.isDeleted);
      this.offline = true;
    }
  },

  methods: {
    async setIndexDB() {
      this.db = await openDB('employeesDB', 1, {
        upgrade(db) {
          db.createObjectStore('employees', { keyPath: 'id' });
        },
      });
    },
    urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    },
    async subscribe() {
      if (!('serviceWorker' in navigator)) {
        console.log('no service worker!');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey),
      });
      await axios.post('/subscribe', subscription);
    },
    updateAvailable() {
      alert('Update vorhanden, bitte App neu starten');
    },
    async fetchData() {
      try {
        let { data } = await axios({
          url: `${this.serverAddress}/employees`,
          method: 'GET',
        });
        data = data.map((el) => ({ ...el, isDeleted: false }));
        this.employees = data;
        const tx = this.db.transaction('employees', 'readwrite');
        await tx.done;
        const IndexDeleted = await this.db
          .getAll('employees')
          .filter((el) => el.isDeleted);
        if (IndexDeleted.length > 0) {
          IndexDeleted.forEach((el) => this.delEmployee(el));
        }
        await this.employees.forEach((el) => this.db.put('employees', el));
      } catch (err) {
        console.log('Catch');
        const tx = this.db.transaction('employees', 'readwrite');
        await tx.done;
        this.employees = await this.db.getAll('employees');
      }
    },
    async delEmployee(e) {
      if (!this.offline) {
        await axios({
          url: `${this.serverAddress}/employees/${e.id}`,
          method: 'DELETE',
        });
        this.fetchData();
      } else {
        let obj = await this.db.get('employees', e.id);
        await this.db.delete('employees', e.id);
        obj.isDeleted = true;
        this.fetchData();
      }
    },
  },
};
</script>

<style></style>

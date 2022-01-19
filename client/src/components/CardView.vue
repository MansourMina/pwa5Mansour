<template>
  <div>
    <div v-show="employees.length > 0">
      <div class="row justify-content-center mt-4">
        <div
          class="card p-2 m-2 bg-light"
          style="width: 22rem"
          v-for="e in employees"
          :key="e.email"
        >
          <img :src="e.picture.large" class="mx-auto d-block" alt="picture of employee" />
          <div class="mx-auto d-block mt-2">
            <h4>Name: {{ e.name.title }} {{ e.name.first }} {{ e.name.last }}</h4>
            <p class="card-text">Email: {{ e.email }}</p>
            <p class="card-text">Phone: {{ e.phone }}</p>
          </div>
          <button @click="$emit('del', e)" class="btn btn-outline-danger mx-auto d-block mt-3">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    employees: {
      type: Array,
    },
  },
};
</script>

<style scoped>
img {
  width: 10rem;
}
</style>
